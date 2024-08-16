"use client";

import { IUser } from "@/components/_model/user/user";
import {
  getUserById,
  paymentsBuyerById,
} from "@/components/_service/user/user.service";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ChatList from "@/components/common/chat/ChatList";
import Payment from "@/app/(payment)/payment/[id]/page";
import CancelPayment from "@/app/(payment)/cancel/[id]/page";
import { IPayment } from "@/components/_model/payment/payment";
import { getLawyerById } from "@/components/_service/lawyer/lawyer.service";
import { findProductById } from "@/components/_service/product/product-service";

const UserSingeInfoPage = () => {
  const dispatch = useDispatch();
  const [payments, setPayments] = useState([] as IPayment[]);
  const currentUser = "user1";
  const [impUid, setImpUid] = useState<string | null>(null);
  const [user, setUser] = useState({} as IUser);
  const lawyers = [
    { id: "lawyer1", name: "Lawyer 1" },
    { id: "lawyer2", name: "Lawyer 2" },
    { id: "lawyer3", name: "Lawyer 3" },
  ];

  const accessToken: string = parseCookies().accessToken;
  const [decodedToken, setDecodedToken] = useState({} as any);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getUser = async () => {
    await dispatch(getUserById(decodedToken.id)).then((res: any) => {
      setUser(res.payload);
      dispatch(paymentsBuyerById(res.payload.id)).then((buy: any) => {
        setPayments(buy.payload);
        const payments = buy.payload;
        fetchRelatedData(payments);
        buy.payload?.map((pay: any) => {
          console.log("pay");
          console.log(pay);
        });
      });
    });
  };

  const fetchRelatedData = async (payments: IPayment[]) => {
    const paymentsWithRelatedData = await Promise.all(
      payments.map(async (payment) => {
        const product = payment.product?.id
          ? await dispatch(findProductById(payment.product.id)).then(
              (res: any) => res.payload
            )
          : null;
        const lawyer = payment.lawyer
          ? await dispatch(getLawyerById(payment.lawyer)).then(
              (res: any) => res.payload
            )
          : null;

        return { ...payment, product, lawyer };
      })
    );
    setPayments(paymentsWithRelatedData);
  };

  useEffect(() => {
    if (!accessToken) {
      return; // or handle the case where there's no token
    }
    setIsLoggedIn(!!accessToken);
    try {
      setDecodedToken(jwtDecode(accessToken));
      if (decodedToken.roles !== undefined) {
        getUser();
      }
    } catch (error) {
      console.log(error);
    }
  }, [isLoggedIn]);

  return (
    <>
      <div className="flex flex-row relative">
        <div className="w-[390px]"></div>
        <div className="w-[390px] h-screen border-x border-[var(--color-Harbor-first)] p-5 items-center fixed top-0 bg-[var(--color-Harbor-firth)]">
          <div
            className="flex items-center justify-center text-[var(--color-Harbor-first)] font-bold text-[22px] cursor-pointer"
            onClick={() => {
              window.location.replace("/");
            }}
          >
            LAWWMATE LOGO
          </div>
          <div className="flex flex-col items-center justify-center pt-12">
            <Image
              src="https://img.icons8.com/?size=100&id=7819&format=png&color=000000"
              width={180}
              height={180}
              alt="user-image"
              priority
              style={{ width: 180, height: 180 }}
              className="text-[var(--color-Harbor-first)]"
            />
            <h1 className=" font-semibold text-[26px] text-[var(--color-Harbor-first)]">
              {user?.name}
            </h1>
            <p className=" text-[var(--color-Harbor-first)]/60 text-[22px]">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="items-center p-20 gap-6 flex flex-col">
          <div className="w-[694px] border-2 border-[var(--color-Harbor-firth)] rounded-2xl p-5">
            <p className="text-[var(--color-Harbor-sec)]">기본정보</p>
            <div className="flex flex-row items-center justify-center p-2">
              <Image
                src="https://img.icons8.com/?size=100&id=7819&format=png&color=000000"
                width={50}
                height={50}
                alt="user-image"
                style={{ width: 50, height: 50 }}
                className="text-[var(--color-Harbor-first)]"
              />
              <div className="w-[600px] px-2">
                <div className="flex flex-row justify-between items-center">
                  <p className="w-[22vw] h-[3vh] text-[14px] px-[1.111vw] bg-white">
                    {user?.name}
                  </p>
                </div>
                <p className="w-[22vw] h-[3vh] text-[14px] px-[1.111vw] bg-white">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="w-[650px] h-[1px] bg-[var(--color-Harbor-firth)] my-2"></div>
            <div className="flex flex-row w-[650px] items-center px-2">
              <p className="w-[100px]">비밀번호</p>
              <div className="flex flex-row w-[550px] justify-between items-center">
                <input
                  type="text"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={user?.password}
                  onChange={(e: any) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  className="w-[22vw] h-[3vh] text-[14px] bg-white"
                />
                <input type="submit" value="수정" className="px-2" />
              </div>
            </div>
            <div className="w-[650px] h-[1px] bg-[var(--color-Harbor-firth)] my-2"></div>
            <div className="flex flex-row w-[650px] items-center px-2">
              <p className="w-[100px]">전화번호</p>
              <div className="flex flex-row w-[550px] justify-between items-center">
                <input
                  type="phone"
                  id="phone"
                  name="phone"
                  placeholder="Phone"
                  value={user?.phone}
                  onChange={(e: any) =>
                    setUser({ ...user, phone: e.target.value })
                  }
                  className="w-[22vw] h-[3vh] text-[14px] bg-white"
                />
                <input type="submit" value="수정" className="px-2" />
              </div>
            </div>
            <div className="w-[650px] h-[1px] bg-[var(--color-Harbor-firth)] my-2"></div>
            <div className="flex flex-row w-[650px] items-center px-2">
              <p className="w-[100px]">Email</p>
              <div className="flex flex-row w-[550px] justify-between items-center">
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={user?.email}
                  onChange={(e: any) =>
                    setUser({ ...user, email: e.target.value })
                  }
                  className="w-[22vw] h-[3vh] text-[14px] bg-white"
                />
                <input type="submit" value="수정" className="px-2" />
              </div>
            </div>
            <div className="flex flex-row w-[650px] items-center px-2 pt-5">
              <p className="w-[100px]">나이</p>
              <div className="flex flex-row w-[550px] justify-between items-center">
                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder="Age"
                  value={user?.age}
                  onChange={(e: any) =>
                    setUser({ ...user, age: e.target.value })
                  }
                  className="w-[22vw] h-[3vh] text-[14px] bg-white"
                />
                <input type="submit" value="수정" className="px-2" />
              </div>
            </div>
            <div className="w-[650px] h-[1px] bg-[var(--color-Harbor-firth)] my-2"></div>
            <div className="flex flex-row w-[650px] items-center px-2">
              <p className="w-[100px]">성별</p>
              <div className="flex flex-row w-[550px] justify-between items-center">
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  placeholder="Gender"
                  value={user?.gender}
                  onChange={(e: any) =>
                    setUser({ ...user, gender: e.target.value })
                  }
                  className="w-[22vw] h-[3vh] text-[14px] bg-white"
                />
                <input type="submit" value="수정" className="px-2" />
              </div>
            </div>
          </div>
          <div className="w-[694px] border-2 border-[var(--color-Harbor-firth)] rounded-2xl p-5">
            <p className="text-[var(--color-Harbor-sec)]">결제 정보</p>
            <div className="flex flex-row w-[650px] items-center px-2 pt-5">
              <p className="w-[100px]">포인트</p>
              <div className="flex flex-row w-[550px] justify-between items-center">
                <Payment />
                <input
                  type="number"
                  id="point"
                  name="point"
                  placeholder="point"
                  value={user?.point}
                  onChange={(e: any) =>
                    setUser({
                      ...user,
                      point: e.target.value,
                    })
                  }
                  className="pl-2 text-[14px] bg-white"
                />
                {/* <input type="submit" value="수정" className="px-2" /> */}
              </div>
            </div>
          </div>
          <div className="w-[694px] border-2 border-[var(--color-Harbor-firth)] rounded-2xl p-5">
            <p className="text-[var(--color-Harbor-sec)]">예약 정보</p>
            <div className="flex flex-row w-[650px] items-center px-2 pt-5">
              <div>
                <div className="flex flex-row gap-5">
                  <div className="flex items-center justify-center">
                    <p className="w-36">상담 정보</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="w-36">변호사</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="w-36">가격</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <p className="w-36">현재 진행상태</p>
                  </div>
                </div>
                <div className="mb-8">
                  {payments.map((payment: any) => (
                    <div key={payment.id} className="flex flex-row gap-5">
                      <div className="flex items-center justify-center">
                        <p className="w-36">{payment?.product?.item_name}</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="w-36">{payment?.lawyer?.name}</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="w-36">{payment?.amount} 원</p>
                      </div>
                      <div className="flex items-center justify-center">
                        <p className="w-36">{payment?.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <CancelPayment impUid={impUid} />
              </div>
            </div>
          </div>
          <ChatList currentUser={user?.name || currentUser} lawyers={lawyers} />
        </div>
      </div>
    </>
  );
};

export default UserSingeInfoPage;
