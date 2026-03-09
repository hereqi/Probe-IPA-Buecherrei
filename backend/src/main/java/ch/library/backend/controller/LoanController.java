package ch.library.backend.controller;

import ch.library.backend.entity.Loan;
import ch.library.backend.exception.BadRequestException;
import ch.library.backend.exception.ResourceNotFoundException;
import ch.library.backend.service.LoanService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "http://localhost:5173")
public class LoanController {

    private static final Logger logger = LoggerFactory.getLogger(LoanController.class);
    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping
    public List<Loan> getAllLoans() {
        logger.info("Alle Ausleihen abrufen");
        return loanService.getAllLoans();
    }

    @GetMapping("/my")
    public List<Loan> getMyLoans(@AuthenticationPrincipal Jwt jwt) {
        String userName = jwt.getClaimAsString("preferred_username");
        logger.info("Ausleihen fuer Benutzer {} abrufen", userName);
        return loanService.getActiveLoansForUser(userName);
    }

    @PostMapping
    public Loan createLoan(
            @RequestParam Long bookId,
            @RequestParam String userId,
            @RequestParam String userName,
            @AuthenticationPrincipal Jwt jwt) {
        logger.info("Neue Ausleihe erstellen: Buch {} fuer {}", bookId, userName);
        Loan loan = loanService.createLoan(bookId, userId, userName);
        if (loan == null) {
            throw new BadRequestException("Buch ist nicht verfuegbar oder existiert nicht");
        }
        return loan;
    }

    @PutMapping("/{id}/return")
    public Loan returnBook(@PathVariable Long id) {
        logger.info("Buch zurueckgeben: Ausleihe {}", id);
        Loan loan = loanService.returnBook(id);
        if (loan == null) {
            throw new ResourceNotFoundException("Ausleihe mit ID " + id + " nicht gefunden");
        }
        return loan;
    }
}