import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation AddUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($description: String!, $title: String!, $bookId: String, $authors: [String], $image: String, $link: String) {
        saveBook(description: $description, title: $title, bookId: $bookId, authors: $authors, image: $image, link: $link) {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                title
                description
                image
                link
            }
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation RemoveBook($bookId: String) {
        removeBook(bookId: $bookId) {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                description
                title
                authors
                image
                link
            }
        }
    }
`;