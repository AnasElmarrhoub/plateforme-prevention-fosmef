import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, userName, campagneTitre, pdfBase64, reservationId, campagneLieu, dateDebut, dateFin } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Adresse email manquante.' }, { status: 400 });
    }

    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    const filename = `Attestation_Reservation_FOSMEF_${reservationId || '001'}.pdf`;
    const cleanBase64 = pdfBase64 ? pdfBase64.replace(/^data:application\/pdf;filename=.*?;base64,/, '').replace(/^data:application\/pdf;base64,/, '') : '';

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #1E293B; max-width: 600px; margin: 0 auto; border: 1px solid #CBD5E1; border-radius: 12px; overflow: hidden;">
        <div style="background-color: #19365D; padding: 22px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 20px; font-weight: bold;">FOSMEF — Prévention Médicale</h1>
          <p style="margin: 6px 0 0 0; font-size: 12px; color: #009BA4; font-weight: bold;">Ministère de l'Économie et des Finances</p>
        </div>
        <div style="padding: 26px; background-color: #F8FAFC;">
          <h2 style="color: #19365D; font-size: 16px; margin-top: 0;">Bonjour ${userName || 'Cher Adhérent'},</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #334155;">
            Votre réservation pour la campagne <strong>${campagneTitre || 'Prévention Sanitaire'}</strong> a bien été validée et enregistrée.
          </p>
          
          <div style="background-color: white; padding: 18px; border-radius: 10px; border: 1px solid #E2E8F0; margin: 20px 0;">
            <p style="margin: 6px 0; font-size: 13px;"><strong>N° de Convocation :</strong> RÉS-${String(reservationId || '001').padStart(6, '0')}</p>
            <p style="margin: 6px 0; font-size: 13px;"><strong>Lieu d'examen :</strong> ${campagneLieu || 'Centre Médical FOSMEF'}</p>
            ${dateDebut ? `<p style="margin: 6px 0; font-size: 13px;"><strong>Période :</strong> Du ${dateDebut} au ${dateFin}</p>` : ''}
            <p style="margin: 6px 0; font-size: 13px; color: #107A49;"><strong>Statut :</strong> ✓ CONVOCATION CONFIRMÉE</p>
          </div>

          <p style="font-size: 13px; color: #64748B; line-height: 1.5;">
            📎 Vous trouverez ci-joint votre <strong>Attestation Officielle de Réservation & Ticket PDF</strong> aux normes de la FOSMEF à présenter lors de votre consultation.
          </p>
        </div>
        <div style="background-color: #E2E8F0; padding: 14px; text-align: center; font-size: 11px; color: #64748B;">
          Fondation des Œuvres Sociales du Personnel du MEF — <a href="https://fosmef.ma" style="color: #009BA4; font-weight: bold; text-decoration: none;">https://fosmef.ma</a>
        </div>
      </div>
    `;

    let transporter;
    let senderAddress = user || 'prevention@fosmef.ma';

    if (!user || !pass) {
      // Create a test account on Ethereal automatically for instant zero-config testing
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      senderAddress = testAccount.user;
    } else {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    }

    const info = await transporter.sendMail({
      from: `"FOSMEF Prévention" <${senderAddress}>`,
      to: email,
      subject: `Confirmation & Ticket de Réservation — ${campagneTitre || 'FOSMEF'}`,
      html: htmlBody,
      attachments: cleanBase64
        ? [
            {
              filename,
              content: cleanBase64,
              encoding: 'base64',
            },
          ]
        : [],
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[ETHEREAL EMAIL PREVIEW] Lien de visualisation de l'email : ${previewUrl}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès.',
      previewUrl: previewUrl || null,
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error);
    return NextResponse.json(
      { error: error.message || 'Erreur d\'envoi d\'email.' },
      { status: 500 }
    );
  }
}
