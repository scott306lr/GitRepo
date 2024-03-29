import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { Endpoints } from '@octokit/types';

type listUserReposResponse =
  Endpoints['GET /users/{username}/repos']['response']['data'];

export const useGetUserRepos = (): [
  listUserReposResponse,
  () => void,
  boolean,
  String
] => {
  const router = useRouter();
  const { username } = router.query;
  const [hasMore, setHasMore] = useState(true);
  const [pageNum, setPageNum] = useState(1);
  const [userRepos, setUserRepos] = useState<listUserReposResponse>([]);
  const [status, setStatus] = useState<String>('loading');

  const fetchRepos = async () => {
    if (username) {
      const url = `https://api.github.com/users/${username}/repos?per_page=10&page=${pageNum}`;
      const data = await axios
        .get(url)
        .then((res: AxiosResponse) => res.data)
        .catch((res: AxiosError) => {
          if (res.response?.status === 403) {
            console.log('API rate limit exceeded');
            setStatus('403');
          } else {
            console.log('API error');
            setStatus('error');
          }
          return;
        });

      if (data?.length) {
        setUserRepos(userRepos.concat(data));
        setHasMore(true);
        setStatus('ok');
      } else {
        setHasMore(false);
      }
    }
  };

  const nextPage = () => {
    setPageNum((prev) => prev + 1);
  };
  
  useEffect(() => {
    setUserRepos([]);
    setPageNum(1);
    fetchRepos();
  }, [username]);

  useEffect(() => {
    if (pageNum > 1) {
      fetchRepos();
    }
  }, [pageNum]);

  return [userRepos, nextPage, hasMore, status];
};

// reset page number when username changes
// fetch repos on nextPage
