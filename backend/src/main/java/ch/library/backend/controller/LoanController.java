package ch.library.backend.controller;

import ch.library.backend.entity.Loan;
import ch.library.backend.service.LoanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/loans")
@CrossOrigin(origins = "http://localhost:5173")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping
    public List<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }

    @GetMapping("/my")
    public List<Loan> getMyLoans(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return loanService.getActiveLoansForUser(userId);
    }

    @PostMapping
    public ResponseEntity<Loan> createLoan(
            @RequestParam Long bookId,
            @RequestParam String userId,
            @RequestParam String userName) {
        Loan loan = loanService.createLoan(bookId, userId, userName);
        if (loan == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(loan);
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<Loan> returnBook(@PathVariable Long id) {
        Loan loan = loanService.returnBook(id);
        if (loan == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(loan);
    }
}