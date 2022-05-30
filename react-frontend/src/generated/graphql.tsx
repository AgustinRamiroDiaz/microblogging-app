import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser?: Maybe<User>;
  post?: Maybe<Post>;
  reply?: Maybe<Post>;
};


export type MutationCreateUserArgs = {
  name: Scalars['String'];
};


export type MutationPostArgs = {
  text: Scalars['String'];
  userId: Scalars['ID'];
};


export type MutationReplyArgs = {
  postId: Scalars['ID'];
  text: Scalars['String'];
  userId: Scalars['ID'];
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  isReplyOf?: Maybe<Post>;
  replies: Array<Post>;
  text: Scalars['String'];
  user: User;
};

export type Query = {
  __typename?: 'Query';
  post?: Maybe<Post>;
  rootPosts: Array<Post>;
  user?: Maybe<User>;
  users: Array<User>;
};


export type QueryPostArgs = {
  id: Scalars['ID'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type Subscription = {
  __typename?: 'Subscription';
  post?: Maybe<Post>;
  rootPosts: Array<Post>;
};


export type SubscriptionPostArgs = {
  id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  posts: Array<Post>;
};

export type GetRootPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRootPostsQuery = { __typename?: 'Query', rootPosts: Array<{ __typename?: 'Post', text: string, id: string }> };

export type GetPostQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetPostQuery = { __typename?: 'Query', post?: { __typename?: 'Post', text: string } | null };


export const GetRootPostsDocument = gql`
    query getRootPosts {
  rootPosts {
    text
    id
  }
}
    `;

/**
 * __useGetRootPostsQuery__
 *
 * To run a query within a React component, call `useGetRootPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRootPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRootPostsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetRootPostsQuery(baseOptions?: Apollo.QueryHookOptions<GetRootPostsQuery, GetRootPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRootPostsQuery, GetRootPostsQueryVariables>(GetRootPostsDocument, options);
      }
export function useGetRootPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRootPostsQuery, GetRootPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRootPostsQuery, GetRootPostsQueryVariables>(GetRootPostsDocument, options);
        }
export type GetRootPostsQueryHookResult = ReturnType<typeof useGetRootPostsQuery>;
export type GetRootPostsLazyQueryHookResult = ReturnType<typeof useGetRootPostsLazyQuery>;
export type GetRootPostsQueryResult = Apollo.QueryResult<GetRootPostsQuery, GetRootPostsQueryVariables>;
export const GetPostDocument = gql`
    query getPost($id: ID!) {
  post(id: $id) {
    text
  }
}
    `;

/**
 * __useGetPostQuery__
 *
 * To run a query within a React component, call `useGetPostQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPostQuery(baseOptions: Apollo.QueryHookOptions<GetPostQuery, GetPostQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
      }
export function useGetPostLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostQuery, GetPostQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostQuery, GetPostQueryVariables>(GetPostDocument, options);
        }
export type GetPostQueryHookResult = ReturnType<typeof useGetPostQuery>;
export type GetPostLazyQueryHookResult = ReturnType<typeof useGetPostLazyQuery>;
export type GetPostQueryResult = Apollo.QueryResult<GetPostQuery, GetPostQueryVariables>;