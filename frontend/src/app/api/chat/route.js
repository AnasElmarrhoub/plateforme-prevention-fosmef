import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const SYSTEM_INSTRUCTION = `
Vous êtes "Assistant FOSMEF AI", l'assistant virtuel intelligent officiel de la Fondation des Œuvres Sociales du Personnel du Ministère de l'Économie et des Finances (FOSMEF).

Votre rôle est d'assister les adhérents et utilisateurs de la plateforme de prévention médicale :
1. **Accompagnement sur la plateforme :** Explication de la réservation aux campagnes de prévention, téléchargement des tickets de réservation au format PDF, consultation de l'historique dans "Mes Réservations", et mise à jour du profil.
2. **Sensibilisation & Prévention Santé :** Fournir des informations générales de prévention médicale (dépistage du diabète, bilan cardiovasculaire, santé buccodentaire, dépistage visuel, nutrition et hygiène de vie).
3. **Missions de la FOSMEF :** Présentation des œuvres sociales et des campagnes de santé organisées par le Ministère.

Style de communication :
- Courtois, professionnel, chaleureux et concis.
- Rédigez vos réponses en français (ou en arabe si l'utilisateur vous écrit en arabe).
- Utilisez des puces et des mises en forme claires (gras, listes).
- Rappelez si nécessaire que vos conseils ne remplacent pas une consultation médicale directe chez un médecin spécialiste.
`;

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // Check if API key is present
    if (!apiKey) {
      const lastUserMsg = messages[messages.length - 1]?.content || '';
      return NextResponse.json({
        reply: `Bonjour ! Je suis l'**Assistant virtuel FOSMEF AI**.\n\n*(Note : Clé \`GEMINI_API_KEY\` non configurée dans le fichier \`.env.local\`).*\n\nJe suis là pour vous assister :\n- 📅 **Réserver une campagne :** Rendez-vous dans l'onglet **Campagnes** puis cliquez sur "Réserver ma place".\n- 📄 **Télécharger votre Ticket PDF :** Allez sur **Mes Réservations** et cliquez sur "Ticket PDF".\n- 💬 **Votre message :** "${lastUserMsg}"`
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Convert messages history to Gemini format (must start with 'user' role)
    const rawHistory = (messages || []).slice(0, -1);
    const firstUserIdx = rawHistory.findIndex((m) => m.role === 'user');
    
    const formattedHistory = [];
    if (firstUserIdx !== -1) {
      const validHistory = rawHistory.slice(firstUserIdx);
      for (const msg of validHistory) {
        formattedHistory.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        });
      }
    }

    const lastMessage = messages[messages.length - 1]?.content || '';

    // List of model candidates in priority order to handle API version variations
    const modelCandidates = [
      'gemini-2.5-flash',
      'gemini-1.5-flash-latest',
      'gemini-2.0-flash',
      'gemini-1.5-pro-latest',
      'gemini-1.5-flash',
    ];

    let replyText = null;
    let lastError = null;

    for (const modelName of modelCandidates) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_INSTRUCTION,
        });

        const chat = model.startChat({
          history: formattedHistory,
        });

        const result = await chat.sendMessage(lastMessage);
        replyText = result.response.text();
        if (replyText) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!replyText) {
      throw lastError || new Error('Erreur lors de la génération du contenu avec Gemini AI.');
    }

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur de connexion avec l\'Assistant Gemini AI.' },
      { status: 500 }
    );
  }
}
