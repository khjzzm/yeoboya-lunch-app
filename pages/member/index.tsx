import type {NextPage} from 'next';
import Layout from '@components/layout';
import {useInfiniteMemberList} from '@libs/hooks/services/queries/member';
import {useEffect, useRef} from 'react';
import useLocalStorage from 'use-local-storage';
import {useObserver} from '@libs/client/useObserver';
import MemberCard from '@components/member/MemberCard';

type TMember = {
  email: string;
  name: string;
  nickName: string;
  phoneNumber: string;
  accountNumber: string;
  bankName: string;
};

const Member: NextPage = () => {
  const member = useInfiniteMemberList();
  const bottom = useRef(null);
  const [scrollY] = useLocalStorage('member_list_scroll', 0);

  const onIntersect: IntersectionObserverCallback = ([entry]) =>
    entry.isIntersecting && member.fetchNextPage();

  useObserver({
    target: bottom,
    onIntersect,
  });

  useEffect(() => {
    if (scrollY !== 0) {
      window.scrollTo(0, Number(scrollY));
    }
  }, []);

  return (
    <Layout canGoBack title="당직자">
      {member.status === 'loading' && <p>불러오는 중</p>}

      {member.status === 'success' &&
        member.data.pages.map((group: any, index: number) => (
          <div key={index}>
            {group.data.data.list.map((data: TMember, index: number) => {
              return (
                <div className="border-b-2" key={index}>
                  <MemberCard
                    email={data.email}
                    name={data.name}
                    nickName={data.nickName}
                    phoneNumber={data.phoneNumber}
                    bankName={data.bankName}
                    accountNumber={data.accountNumber}
                  />
                </div>
              );
            })}
          </div>
        ))}

      <div ref={bottom} />
      {member.isFetchingNextPage && <p>계속 불러오는 중</p>}
    </Layout>
  );
};

export default Member;
