package com.cloudcrafters.interviewservice.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class PDFGeneratorService {
    public void export(HttpServletResponse response, String lastName, String firstName) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());

        document.open();
        Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fontTitle.setSize(18);

        Paragraph title = new Paragraph("Interview Invitation", fontTitle);
        title.setAlignment(Paragraph.ALIGN_CENTER);

        Font fontContent = FontFactory.getFont(FontFactory.HELVETICA);
        fontContent.setSize(12);

        Paragraph message = new Paragraph("Dear " + firstName + " " + lastName + ",\n\n"
                + "Thank you for applying for the position. We are pleased to invite you for an interview. "
                + "Please find attached the details of the interview schedule.\n\n"
                + "Best regards,\n"
                + "The talentGateway Team", fontContent);
        message.setAlignment(Paragraph.ALIGN_LEFT);

        document.add(title);
        document.add(message);
        document.close();
    }

}