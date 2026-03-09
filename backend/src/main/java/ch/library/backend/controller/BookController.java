package ch.library.backend.controller;

import ch.library.backend.dto.BookRequest;
import ch.library.backend.entity.Book;
import ch.library.backend.exception.ResourceNotFoundException;
import ch.library.backend.service.BookService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")
public class BookController {

    private static final Logger logger = LoggerFactory.getLogger(BookController.class);
    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public List<Book> getAllBooks() {
        logger.info("Alle Buecher abrufen");
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable Long id) {
        logger.info("Buch mit ID {} abrufen", id);
        Book book = bookService.getBookById(id);
        if (book == null) {
            throw new ResourceNotFoundException("Buch mit ID " + id + " nicht gefunden");
        }
        return book;
    }

    @GetMapping("/available")
    public List<Book> getAvailableBooks() {
        logger.info("Verfuegbare Buecher abrufen");
        return bookService.getAvailableBooks();
    }

    @PostMapping
    public Book createBook(@Valid @RequestBody BookRequest request) {
        logger.info("Neues Buch erstellen: {}", request.getTitle());
        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setIsbn(request.getIsbn());
        return bookService.saveBook(book);
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @Valid @RequestBody BookRequest request) {
        logger.info("Buch mit ID {} aktualisieren", id);
        Book existing = bookService.getBookById(id);
        if (existing == null) {
            throw new ResourceNotFoundException("Buch mit ID " + id + " nicht gefunden");
        }
        existing.setTitle(request.getTitle());
        existing.setAuthor(request.getAuthor());
        existing.setIsbn(request.getIsbn());
        return bookService.saveBook(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        logger.info("Buch mit ID {} loeschen", id);
        bookService.deleteBook(id);
        return ResponseEntity.ok().build();
    }
}