package com.documentManagement.secure_document_manager;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentRepository documentRepository;

    public DocumentController(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    @GetMapping
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    @GetMapping("/{id}")
    public Document getDocumentById(@PathVariable Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    @PostMapping
    public Document createDocument(@RequestBody Document document) {
        return documentRepository.save(document);
    }

    @PutMapping("/{id}")
    public Document updateDocument(
            @PathVariable Long id,
            @RequestBody Document document) {

        Document existingDocument = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        existingDocument.setDocumentName(document.getDocumentName());
        existingDocument.setCategory(document.getCategory());
        existingDocument.setIssueDate(document.getIssueDate());
        existingDocument.setExpiryDate(document.getExpiryDate());
        existingDocument.setNotes(document.getNotes());

        return documentRepository.save(existingDocument);
    }

    @DeleteMapping("/{id}")
    public String deleteDocument(@PathVariable Long id) {
        documentRepository.deleteById(id);
        return "Document deleted successfully";
    }

    @GetMapping("/status/expired")
    public List<Document> getExpiredDocuments() {
        return documentRepository.findByExpiryDateBefore(LocalDate.now());
    }

    @GetMapping("/status/expiring-soon")
    public List<Document> getExpiringSoonDocuments() {

        LocalDate today = LocalDate.now();
        LocalDate next30Days = today.plusDays(30);

        return documentRepository.findByExpiryDateBetween(
                today,
                next30Days
        );
    }
}