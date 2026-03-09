package ch.library.backend.repository;

import ch.library.backend.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByUserId(String userId);
    
    List<Loan> findByUserIdAndStatus(String userId, String status);

    List<Loan> findByUserNameAndStatus(String userName, String status);
}