package com.documentManagement.secure_document_manager;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    List<Document> findByExpiryDateBefore(LocalDate date);

    List<Document> findByExpiryDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );
}