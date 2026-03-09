package ch.library.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BookRequest {

    @NotBlank(message = "Titel ist erforderlich")
    @Size(max = 255, message = "Titel darf maximal 255 Zeichen haben")
    private String title;

    @NotBlank(message = "Autor ist erforderlich")
    @Size(max = 255, message = "Autor darf maximal 255 Zeichen haben")
    private String author;

    @Size(max = 50, message = "ISBN darf maximal 50 Zeichen haben")
    private String isbn;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }

    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
}
