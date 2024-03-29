import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useGetUserInfo } from '../../../hooks/useGetUserInfo';
import { useGetUserRepos } from '../../../hooks/useGetUserRepos';
import Topbar from '../../../components/Topbar';
import ReposList from '../../../components/ReposList';
import Spinner from '../../../components/Spinner';

const Repos: NextPage = () => {
  const router = useRouter();
  const { username } = router.query;
  const [userInfo, uStatus] = useGetUserInfo();
  const [userRepos, nextPage, hasMore, rStatus] = useGetUserRepos();

  return (
    <div className="flex flex-col h-screen w-screen bg-bg_color">
      <Head>
        <title>GitRepo - Repos Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Topbar />

      <main
        className={`${
          uStatus === 'ok' ? 'flex-center' : 'hidden'
        } items-stretch h-full w-full p-2 bg-bg_color`}
      >
        <div className="flex-center flex-col md:flex-row w-5/6 rounded-lg bg-white m-4">
          <div className="flex flex-col items-center space-y-4">
            <Link href={`${userInfo?.html_url}`}>
              <img
                src={`${userInfo?.avatar_url}`}
                className="flex w-4/5 max-w-[14rem] md:max-w-[24rem] rounded-full border-2 border-hov_color cursor-pointer hover:shadow-lg"
              />
            </Link>
            <header className="text-xl"> {userInfo?.name} </header>
          </div>
          <div className="flex flex-col md:flex-grow h-1/2 w-4/5 max-w-[30rem] p-5">
            <h3>{`Public Repositories ${
              userInfo ? '(' + userInfo?.public_repos + ')' : ''
            }:`}</h3>

            <div className="flex-center flex-grow h-52 w-full py-5">
              <ReposList
                data={userRepos}
                nextPage={nextPage}
                hasMore={hasMore}
                status={rStatus}
              />
            </div>
          </div>
        </div>
      </main>

      <h1
        id="loading"
        className={`h-full w-full ${
          uStatus === 'loading' ? 'flex' : 'hidden'
        } items-center justify-center text-2xl text-gray-300`}
      >
        <Spinner size={20} />
      </h1>

      <h1
        id="404"
        className={`h-full w-full ${
          uStatus === 'error' ? 'flex' : 'hidden'
        } items-center justify-center text-2xl text-gray-300`}
      >
        {`User "${username}" Not Found!`}
      </h1>

      <h1
        id="403"
        className={`h-full w-full ${
          uStatus === '403' ? 'flex' : 'hidden'
        } items-center justify-center text-2xl text-gray-300`}
      >
        API rate limit exceeded !
      </h1>
    </div>
  );
};

export default Repos;
