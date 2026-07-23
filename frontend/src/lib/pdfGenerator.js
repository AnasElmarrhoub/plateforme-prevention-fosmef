import jsPDF from 'jspdf';

/**
 * Loads an image from a URL and converts it to Base64 data URL.
 */
function loadImageDataUrl(url) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve({
          dataUrl: canvas.toDataURL('image/png'),
          width: canvas.width,
          height: canvas.height,
        });
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Generates an executive, official Moroccan Ministry administrative document (Convocation & Attestation).
 * Uses official project brand colors (#19365D for brand-blue, #009BA4 for brand-teal, #B51F5F for brand-ruby).
 * @param {Object} reservation - Reservation details object
 * @param {Object} currentUser - Logged in user info
 * @param {Object} options - Options ({ download: true/false })
 * @returns {Promise<{ doc: jsPDF, pdfBase64: string, filename: string }>}
 */
export async function generateTicketPDF(reservation, currentUser = null, options = { download: true }) {
  if (!reservation) return null;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Preload logos
  const [ministereImg, fosImg] = await Promise.all([
    loadImageDataUrl('/ministere-logo.png'),
    loadImageDataUrl('/fos-logo.png'),
  ]);

  // Official Project Palette from globals.css
  const brandBlue = [25, 54, 93];       // #19365D (Project Brand Blue)
  const brandTeal = [0, 155, 164];      // #009BA4 (Project Brand Teal)
  const brandRuby = [181, 31, 95];      // #B51F5F (Project Brand Ruby)
  const forestGreen = [16, 122, 73];    // #107A49 (Emerald Validation)
  const slateDark = [30, 41, 59];        // #1E293B (Primary Text)
  const slateMuted = [100, 116, 139];    // #64748B (Secondary Text)
  const bgCard = [248, 250, 252];        // #F8FAFC (Card Background)
  const borderCard = [203, 213, 225];    // #CBD5E1 (Border Slate)

  // Page Border / Framing Lines
  doc.setDrawColor(...brandBlue);
  doc.setLineWidth(0.6);
  doc.rect(8, 8, 194, 281, 'S');

  doc.setDrawColor(...brandTeal);
  doc.setLineWidth(0.25);
  doc.rect(9.5, 9.5, 191, 278, 'S');

  // 1. INSTITUTIONAL HEADER WITH LOGOS
  if (ministereImg?.dataUrl) {
    const aspect = ministereImg.width / ministereImg.height;
    const h = 22;
    const w = h * aspect;
    doc.addImage(ministereImg.dataUrl, 'PNG', 14, 13, Math.min(w, 52), h);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...brandBlue);
    doc.text("MINISTÈRE DE L'ÉCONOMIE", 14, 20);
    doc.text("ET DES FINANCES", 14, 24);
  }

  if (fosImg?.dataUrl) {
    const aspect = fosImg.width / fosImg.height;
    const h = 22;
    const w = h * aspect;
    const finalW = Math.min(w, 52);
    doc.addImage(fosImg.dataUrl, 'PNG', 196 - finalW, 13, finalW, h);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...brandBlue);
    doc.text("FOSMEF", 196, 22, { align: 'right' });
  }

  // Official Central Header Text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...brandBlue);
  doc.text('ROYAUME DU MAROC', 105, 16, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slateDark);
  doc.text("MINISTÈRE DE L'ÉCONOMIE ET DES FINANCES", 105, 21, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...brandBlue);
  doc.text('FONDATION DES ŒUVRES SOCIALES DU PERSONNEL DU MEF', 105, 25.5, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateMuted);
  doc.text("Pôle Action Sanitaire & Prévention Médicale", 105, 29.5, { align: 'center' });

  // Header Ornamental Line Separator
  doc.setDrawColor(...brandBlue);
  doc.setLineWidth(0.6);
  doc.line(14, 38, 196, 38);

  doc.setDrawColor(...brandTeal);
  doc.setLineWidth(0.3);
  doc.line(14, 39.2, 196, 39.2);

  // 2. DOCUMENT TITLE & OFFICIAL REFERENCE BAR
  let y = 46;

  doc.setFillColor(...brandBlue);
  doc.roundedRect(14, y, 182, 14, 1.5, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(255, 255, 255);
  doc.text('ATTESTATION DE RÉSERVATION & CONVOCATION MÉDICALE', 20, y + 9);

  const refCode = `RÉF : FOS/PM-${new Date().getFullYear()}-${String(reservation.id || '001').padStart(5, '0')}`;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text(refCode, 190, y + 9, { align: 'right' });

  y += 20;

  // 3. OFFICIAL VALIDATION STAMP & CONVOCATION STATUS
  doc.setFillColor(240, 253, 244); // Light Emerald
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, y, 182, 12, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...forestGreen);
  doc.text('STATUT DE LA DEMANDE : CONVOCATION CONFIRMÉE & VALIDÉE', 20, y + 7.5);

  const dateEmission = reservation.dateReservation ? new Date(reservation.dateReservation).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleString('fr-FR');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(22, 101, 52);
  doc.text(`Délivré le : ${dateEmission}`, 190, y + 7.5, { align: 'right' });

  y += 18;

  // 4. BENEFICIARY / ADHERENT ADMINISTRATIVE FILE BOX
  doc.setFillColor(...bgCard);
  doc.roundedRect(14, y, 182, 48, 2, 2, 'F');
  doc.setDrawColor(...borderCard);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, y, 182, 48, 2, 2, 'S');

  // Left vertical brand-blue accent bar
  doc.setFillColor(...brandBlue);
  doc.rect(14, y, 3.5, 48, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...brandBlue);
  doc.text("I. IDENTIFICATION DE L'ADHÉRENT BÉNÉFICIAIRE", 22, y + 9);

  const name = reservation.userName || (currentUser ? `${currentUser.prenom || ''} ${currentUser.nom || ''}`.trim() || currentUser.name : null) || 'Adhérent FOSMEF';
  const email = reservation.userEmail || currentUser?.email || 'Non renseigné';
  const ppm = reservation.userPpm || currentUser?.ppm || 'Non renseigné';
  const tel = reservation.userTelephone || currentUser?.telephone || 'Non renseigné';

  doc.setFontSize(8.5);
  const userFields = [
    { label: 'Nom & Prénom :', value: name },
    { label: 'Matricule / N° PPR :', value: ppm },
    { label: 'Adresse Email :', value: email },
    { label: 'N° de Téléphone :', value: tel },
    { label: 'Statut du Bénéficiaire :', value: 'Adhérent actif FOSMEF (Ministère de l\'Économie et des Finances)' },
  ];

  let curY = y + 17;
  userFields.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...slateMuted);
    doc.text(item.label, 22, curY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...slateDark);
    doc.text(String(item.value), 68, curY);

    curY += 6;
  });

  y += 54;

  // 5. CAMPAIGN & MEDICAL APPOINTMENT BOX
  doc.setFillColor(...bgCard);
  doc.roundedRect(14, y, 182, 50, 2, 2, 'F');
  doc.setDrawColor(...borderCard);
  doc.roundedRect(14, y, 182, 50, 2, 2, 'S');

  // Left vertical brand-teal accent bar
  doc.setFillColor(...brandTeal);
  doc.rect(14, y, 3.5, 50, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...brandBlue);
  doc.text("II. DÉTAILS DE LA CONVOCATION MÉDICALE", 22, y + 9);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Non précisée';

  const campaignTitle = reservation.campagneTitre || 'Campagne Nationale de Prévention Médicale';
  const lieu = reservation.campagneLieu || 'Centre Médical et Sanitaire FOSMEF';
  const dateDebut = formatDate(reservation.campagneDateDebut);
  const dateFin = formatDate(reservation.campagneDateFin);

  const campFields = [
    { label: 'Action Préventive :', value: campaignTitle },
    { label: 'Lieu de Convocation :', value: lieu },
    { label: 'Période d\'examen :', value: `Du ${dateDebut} au ${dateFin}` },
    { label: 'Type de Prise en charge :', value: 'Couverture Intégrale - Pris en charge par la FOSMEF' },
  ];

  curY = y + 17;
  campFields.forEach((item) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...slateMuted);
    doc.text(item.label, 22, curY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...slateDark);
    
    // Split long values
    const splitVal = doc.splitTextToSize(String(item.value), 120);
    doc.text(splitVal, 68, curY);

    curY += (splitVal.length * 5.5) + 1;
  });

  y += 56;

  // 6. OFFICIAL INSTRUCTIONS & REGULATORY NOTICE
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(14, y, 182, 38, 2, 2, 'F');
  doc.setDrawColor(...borderCard);
  doc.roundedRect(14, y, 182, 38, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...brandBlue);
  doc.text("CONSIGNES ET PIÈCES À PRÉSENTER AU CENTRE D'EXAMEN :", 20, y + 7.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateDark);

  const instructions = [
    "1. Présenter obligatoirement la Carte d'Identité Nationale (CIN) et la Carte d'Adhérent FOSMEF.",
    "2. Se munir du présent document (version imprimée sur papier ou téléchargée sur smartphone).",
    "3. Se présenter au centre de consultation 15 minutes avant le créneau indiqué.",
    "4. En cas d'empêchement, veuillez annuler votre réservation via le portail FOSMEF au moins 24h à l'avance."
  ];

  let instY = y + 14;
  instructions.forEach((line) => {
    doc.text(line, 20, instY);
    instY += 5.5;
  });

  y += 44;

  // 7. SECURITY & AUTHENTICATION BLOCK (FULL WIDTH - CACHET REMOVED)
  doc.setFillColor(...bgCard);
  doc.roundedRect(14, y, 182, 28, 2, 2, 'F');
  doc.setDrawColor(...borderCard);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, y, 182, 28, 2, 2, 'S');

  // Barcode graphics
  const barXStart = 20;
  const barY = y + 5;
  const barHeight = 12;
  const pattern = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 3, 1, 2, 1, 4, 2, 1, 2, 3, 1, 2, 1, 3, 2, 1, 2];
  doc.setFillColor(...brandBlue);
  pattern.forEach((w, i) => {
    doc.rect(barXStart + (i * 2.1), barY, w * 0.5, barHeight, 'F');
  });

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...slateMuted);
  doc.text(`CODE DE VÉRIFICATION AUTOMATISÉ : FOS-VAL-${reservation.id || '001'}-${Date.now().toString().slice(-8)}`, 20, y + 22);

  // Security Label Right Side
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...brandTeal);
  doc.text("ATTESTATION NUMÉRIQUE AUTHENTIFIÉE", 188, y + 10, { align: 'right' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateMuted);
  doc.text("Document valide sans signature manuscrite.", 188, y + 15, { align: 'right' });
  doc.text("Système d'Information FOSMEF - Action Sanitaire", 188, y + 19, { align: 'right' });

  // 8. LEGAL FOOTER
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text("Fondation des Œuvres Sociales du Personnel du Ministère de l'Économie et des Finances — Service Prévention Médicale", 105, 283, { align: 'center' });
  doc.text("Document officiel généré numériquement via la Plateforme FOSMEF (https://fosmef.ma). Fait valoir ce que de droit.", 105, 287, { align: 'center' });

  // Save the document if download is enabled
  const sanitizedTitle = (reservation.campagneTitre || 'Convocation').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Attestation_Reservation_FOSMEF_${reservation.id || 'N'}_${sanitizedTitle}.pdf`;
  
  if (options && options.download !== false) {
    doc.save(filename);
  }

  const pdfBase64 = doc.output('datauristring');
  return { doc, pdfBase64, filename };
}
