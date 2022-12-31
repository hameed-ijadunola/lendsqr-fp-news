import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
const baseUrl = 'https://api.newscatcherapi.com/v2/';
export const newsApi2 = createApi({
  reducerPath: 'newsApi2',
  baseQuery: fetchBaseQuery({
    baseUrl,
    headers: {
      'x-api-key': 'eS51Jikz9N7sbkGyrbTW8dRq1z2PdWDWs0nEEhcHbkk',
    },
  }),
  endpoints: builder => ({
    getNewsBySearch: builder.mutation({
      query: ({q, page, page_size}) => {
        return {
          url: 'search',
          params: {q, lang: 'en', sort_by: 'relevancy', page, page_size},
          method: 'GET',
        };
      },
    }),
    getLatestHeadlines: builder.mutation({
      query: ({page, page_size}) => {
        return {
          url: 'latest_headlines',
          params: {lang: 'en', when: '14d', page, page_size},
        };
      },
    }),
  }),
});

export const {useGetNewsBySearchMutation, useGetLatestHeadlinesMutation} =
  newsApi2;
