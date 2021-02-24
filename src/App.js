import { useState } from 'react';
import client from './client';
// GraphQLのクエリを送信するためのコンポーネント
import { ApolloProvider, Mutation, Query } from 'react-apollo';
import { ME } from './graphql';
import { SEARCH_REPOSITORIES, ADD_STAR, REMOVE_STAR } from './graphql';

// starの数を表示させるボタンコンポーネント
const StarButton = props => {
  const node = props.node
  const totalCount = node.stargazers.totalCount;
  const viewerHasStarred = node.viewerHasStarred
  const starCount = totalCount === 1 ? "1 star" : `${totalCount} stars`
  const StarStatus = ({addOrRemoveStar}) => {
    return (
      <button
        onClick={
          () => addOrRemoveStar({
            variables: { input: { starrableId: node.id }}
          })
        }
      >
        {starCount} | {viewerHasStarred ? 'starred' : '-'}
      </button>
    )
  }

  return (
    <Mutation mutation={viewerHasStarred ? REMOVE_STAR : ADD_STAR}>
      {
        addOrRemoveStar => <StarStatus addOrRemoveStar={addOrRemoveStar}/>
      }
    </Mutation>
  )
}

const PER_PAGE = 5;
const DEFAULT_STATE = {
  // GraphQLのクエリをJavaScriptで書くときはJSONではなく連想配列形式で書く
  first: PER_PAGE,
  after: null,
  last: null,
  before: null,
  query: "フロントエンドエンジニア"
}

const App = () => {
  // stateの初期化
  const [ variables, setVariables ] = useState(DEFAULT_STATE)

  // Previousボタン押下時の処理。前の5件のページ情報を表示させる
  const goPrevious = search => {
    setVariables({
      ...variables,
      first: null,
      after: null,
      last: PER_PAGE,
      before: search.pageInfo.startCursor
    })
  }

  // Nextボタン押下時の処理。次の5件のページ情報を表示させる
  const goNext = search => {
    setVariables({
      ...variables,
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null
    })
  }

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
            return (
              <>
                <h2>{title}</h2>
                <ul>
                  {
                    search.edges.map((edge, key) => {
                      const node = edge.node
                      return (
                        <li key={key}>
                          <a href={node.url} target="_brank">{node.name}</a>
                          &nbsp;
                          <StarButton node={node}/>
                        </li>
                      )
                    })
                  }
                </ul>

                {
                    search.pageInfo.hasPreviousPage === true ?
                    <button
                      onClick={e => goPrevious(search)}
                    >
                      Previous
                    </button>
                    :
                    null
                  }

                {
                    search.pageInfo.hasNextPage === true ?
                    <button
                      onClick={e => goNext(search)}
                    >
                      Next
                    </button>
                    :
                    null
                  }
              </>
            )
          }
        }
      </Query>
    </ApolloProvider>
  );
}

export default App;
