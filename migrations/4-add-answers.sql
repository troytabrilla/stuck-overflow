CREATE TABLE answers (
    id INT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    body TEXT NOT NULL,
    score INT NOT NULL,
    accepted BOOLEAN NOT NULL,
    creation TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT NOT NULL REFERENCES users(id),
    question_id INT NOT NULL REFERENCES questions(id)
);