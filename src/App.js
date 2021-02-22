import { useState } from 'react';
import client from './client';
import { ApolloProvider } from 'react-apollo';
// GraphQLのクエリを送信するためのコンポーネント
import { Query } from 'react-apollo';
import { ME } from './graphql';
import { SEARCH_REPOSITORIES } from './graphql';

const VARIAVLES = {
  // GraphQLのクエリをJavaScriptで書くときはJSONではなく連想配列形式で書く
  first: 5,
  after: null,
  last: null,
  before: null,
  query: "フロントエンドエンジニア"
}

const App = () => {
  // stateの初期化
  const [ query, setQuery ] = useState(VARIAVLES)

  return (
    <ApolloProvider client={client}>
      {/* <Query query={ME}>
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
      </Query> */}
      <Query
        query={SEARCH_REPOSITORIES}
        variables={query}
      >
        {
          ({loading, error, data}) => {
            // ロード中の場合
            if(loading) return 'loading...'
            //  エラーの場合
            if(error) return `Error ${error.message}`
            // 正常にデータが返ってきた場合
            console.log(data)
            return <div></div>
          }
        }
      </Query>
    </ApolloProvider>
  );
}

export default App;
