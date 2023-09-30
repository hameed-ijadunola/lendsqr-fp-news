import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import remoteConfig from '@react-native-firebase/remote-config';
import perf from '@react-native-firebase/perf';
import { API_BASE_URL, API_KEY, API_ROUTE } from '@env';

const baseUrl = remoteConfig().getValue('baseUrl').asString() || API_BASE_URL;
const key = remoteConfig().getValue('key').asString() || API_KEY;
const route = remoteConfig().getValue('route').asString() || API_ROUTE;

console.log({ baseUrl, key, route });

const startTrace = (name) => {
  const trace = perf().startTrace(name);
  return trace;
};

const stopTrace = (trace, error) => {
  trace.stop();
  if (error) {
    console.error('HTTP request error:', error);
  }
};

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    headers: {
      'x-api-key': key,
    },
  }),
  endpoints: (builder) => ({
    getLatestHeadlines: builder.mutation({
      query: (data) => {
        return {
          url: route,
          params: data,
          method: 'GET',
        };
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // `onStart` side-effect
        const metric = await perf().newHttpMetric(baseUrl + route, 'GET');
        console.log('Requesting...');
        await metric.start();
        try {
          const {
            data,
            meta: { response },
          } = await queryFulfilled;
          metric.setHttpResponseCode(response.status);
          metric.setResponseContentType(response.headers.get('Content-Type'));

          console.log('Request done!');
          await metric.stop();
        } catch (err) {
          await metric.stop();
          console.log('Error!');
        }
      },
    }),
  }),
});

export const { useGetLatestHeadlinesMutation } = newsApi;
