import client from './client';
import { ApolloProvider } from 'react-apollo';
// GraphQLのコードをparse(JS => GraphQLのクエリに変換)してくれる
import gql from 'graphql-tag';
// GraphQLのクエリを送信するためのコンポーネント
import { Query } from 'react-apollo';

const ME = gql`
  query me {
    user(login: "YosukeShibazaki") {
      id
      avatarUrl
    }
  }
`

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">Hello, GraphQL</div>
      <Query query={ME}>
        {
          ({loading, error, data}) => {
            // ロード中の場合
            if(loading) return 'loading...'
            //  エラーの場合
            if(error) return `Error ${error.message}`
            // 正常にデータが返ってきた場合
            console.log(data.user)
            return <div>{data.user.id}</div>
          }
        }
      </Query>
    </ApolloProvider>
  );
}

export default App;
