CREATE TABLE answer_comments (
    answer_id INT NOT NULL REFERENCES answers(id),
    comment_id INT NOT NULL REFERENCES comments(id),
    PRIMARY KEY(answer_id, comment_id)
);
