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

export type RootPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type RootPostsQuery = { __typename?: 'Query', rootPosts: Array<{ __typename?: 'Post', text: string, id: string }> };


export const RootPostsDocument = gql`
    query RootPosts {
  rootPosts {
    text
    id
  }
}
    `;

/**
 * __useRootPostsQuery__
 *
 * To run a query within a React component, call `useRootPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRootPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRootPostsQuery({
 *   variables: {
 *   },
 * });
 */
export function useRootPostsQuery(baseOptions?: Apollo.QueryHookOptions<RootPostsQuery, RootPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RootPostsQuery, RootPostsQueryVariables>(RootPostsDocument, options);
      }
export function useRootPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RootPostsQuery, RootPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RootPostsQuery, RootPostsQueryVariables>(RootPostsDocument, options);
        }
export type RootPostsQueryHookResult = ReturnType<typeof useRootPostsQuery>;
export type RootPostsLazyQueryHookResult = ReturnType<typeof useRootPostsLazyQuery>;
export type RootPostsQueryResult = Apollo.QueryResult<RootPostsQuery, RootPostsQueryVariables>;