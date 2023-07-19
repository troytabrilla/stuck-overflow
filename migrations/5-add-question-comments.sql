CREATE TABLE question_comments (
    question_id INT NOT NULL REFERENCES questions(id),
    comment_id INT NOT NULL REFERENCES comments(id)
);
