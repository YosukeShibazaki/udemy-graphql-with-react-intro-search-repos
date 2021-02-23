import { useState } from 'react';
import client from './client';
import { ApolloProvider } from 'react-apollo';
// GraphQLのクエリを送信するためのコンポーネント
import { Query } from 'react-apollo';
import { ME } from './graphql';
import { SEARCH_REPOSITORIES } from './graphql';

const DEFAULT_STATE = {
  // GraphQLのクエリをJavaScriptで書くときはJSONではなく連想配列形式で書く
  first: 5,
  after: null,
  last: null,
  before: null,
  query: "フロントエンドエンジニア"
}

const App = () => {
  // stateの初期化
  const [ variables, setVariables ] = useState(DEFAULT_STATE)

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
      <form onSubmit={e => e.preventDefault()}>
        <input
          value={variables.query}
          onChange={e => setVariables({...variables, query: e.target.value})}
        />
      </form>
      <Query
        query={SEARCH_REPOSITORIES}
        variables={variables}
      >
        {
          ({loading, error, data}) => {
            // ロード中の場合
            if(loading) return 'loading...'
            //  エラーの場合
            if(error) return `Error ${error.message}`
            // 正常にデータが返ってきた場合
            console.log(data)

            const search = data.search;
            const repositoryCount = search.repositoryCount;
            const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories';
            const title = `GitHub Repositories Search Results ${repositoryCount} ${repositoryUnit}`
            return <h2>{title}</h2>
          }
        }
      </Query>
    </ApolloProvider>
  );
}

export default App;
