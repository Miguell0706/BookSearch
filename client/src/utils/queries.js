import { gql } from "@apollo/client";

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        bookAuthors
        description
        title
        image
        link
      }
    }
  }
`;
