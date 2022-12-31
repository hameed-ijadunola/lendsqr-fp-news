import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
const baseUrl = 'https://api.newscatcherapi.com/v2/';
export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    headers: {
      'x-api-key': 'RHSVVLZKYOFEFzP45cJqN2uw_3ps9_LnUboxc0zbuC0',
    },
  }),
  endpoints: builder => ({
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

export const {useGetLatestHeadlinesMutation} = newsApi;
