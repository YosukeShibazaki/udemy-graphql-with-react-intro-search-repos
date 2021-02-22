// GraphQLのコードをparse(JS => GraphQLのクエリに変換)してくれる
import gql from 'graphql-tag';

export const ME = gql`
  query me {
    user(login: "YosukeShibazaki") {
      id
      avatarUrl
    }
  }
`