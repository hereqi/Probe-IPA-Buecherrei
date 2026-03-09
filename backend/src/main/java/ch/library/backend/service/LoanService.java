package ch.library.backend.service;

import ch.library.backend.entity.Book;
import ch.library.backend.entity.Loan;
import ch.library.backend.repository.BookRepository;
import ch.library.backend.repository.LoanRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class LoanService {

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;

    public LoanService(LoanRepository loanRepository, BookRepository bookRepository) {
        this.loanRepository = loanRepository;
        this.bookRepository = bookRepository;
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public List<Loan> getLoansByUser(String userId) {
        return loanRepository.findByUserId(userId);
    }

    public List<Loan> getActiveLoansForUser(String userName) {
        return loanRepository.findByUserNameAndStatus(userName, "ACTIVE");
    }

    public Loan createLoan(Long bookId, String userId, String userName) {
        Book book = bookRepository.findById(bookId).orElse(null);
        if (book == null || !"AVAILABLE".equals(book.getStatus())) {
            return null;
        }

        book.setStatus("BORROWED");
        bookRepository.save(book);

        Loan loan = new Loan();
        loan.setBook(book);
        loan.setUserId(userId);
        loan.setUserName(userName);
        loan.setLoanDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusWeeks(4));
        loan.setStatus("ACTIVE");

        return loanRepository.save(loan);
    }

    public Loan returnBook(Long loanId) {
        Loan loan = loanRepository.findById(loanId).orElse(null);
        if (loan == null) {
            return null;
        }

        loan.setReturnDate(LocalDate.now());
        loan.setStatus("RETURNED");

        Book book = loan.getBook();
        book.setStatus("AVAILABLE");
        bookRepository.save(book);

        return loanRepository.save(loan);
    }
}