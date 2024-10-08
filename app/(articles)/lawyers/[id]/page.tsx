"use client";

import IssuePage from "@/app/(issue)/issue/[id]/page";
import SubmitIssuePage from "@/app/(issue)/submit-issue/page";
import CancelPayment from "@/app/(payment)/cancel/[id]/page";
import Payment from "@/app/(payment)/payment/[id]/page";
import Product from "@/app/(product)/products/[id]/page";
import { ILawyer, ILawyerDetail } from "@/components/_model/lawyer/lawyer";
import { IPayment } from "@/components/_model/payment/payment";
import {
  getLawyerById,
  getLawyerDetailById,
} from "@/components/_service/lawyer/lawyer.service";
import { savePayment } from "@/components/_service/payment/payment-service";
import ChatList from "@/components/common/chat/ChatList";
import { userURL } from "@/components/common/url";
import UserId from "@/components/hooks/userId";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

declare global {
  interface Window {
    IMP?: any;
  }
}

const LawyerByIdPage = (props: any) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [consultingType, setconsultingType] = useState<string>("");
  const [productsName, setProductsName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const lawyerId = props.params.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpen, setSelectedOpen] = useState({
    consultationType: false,
    date: false,
    time: false,
  });
  const [lawyerDetail, setLawyerDetail] = useState<any>({} as ILawyerDetail);
  const [lawyer, setLawyer] = useState<any>({} as ILawyer);
  const [consultation, setConsultation] = useState(false);
  const [products, setProducts] = useState<any[]>([]); // To hold products data
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [price, setPrice] = useState<number>(0);
  const [impUid, setImpUid] = useState<string | null>(null);
  const consultationType = [
    {
      type: "15분 전화 상담",
      price: lawyerDetail.phoneCost,
    },
    {
      type: "20분 영상 상담",
      price: lawyerDetail.videoCost,
    },
    {
      type: "30분 방문 상담",
      price: lawyerDetail.visitCost,
    },
  ];

  const dateType = [
    {
      type: "2024-08-20",
    },
    {
      type: "2024-08-21",
    },
    {
      type: "2024-08-22",
    },
  ];

  const timeType = [
    {
      type: "10:00",
    },
    {
      type: "11:00",
    },
    {
      type: "12:00",
    },
  ];

  const userId = parseInt(UserId() || "");

  const requestPay = async (amount: number) => {
    const confirmMessage = `결제할 금액은 ${amount}원 입니다. 계속 진행하시겠습니까?`;
    const isConfirmed = window.confirm(confirmMessage);
    window.IMP.init("imp78717406");

    if (!window.IMP) {
      console.error("IMP is not loaded");
      return;
    }

    if (isConfirmed) {
      window.IMP.request_pay(
        {
          pg: "html5_inicis",
          pay_method: "card",
          orderUid: new Date().getTime().toString(),
          name: "포인트",
          amount: amount,
          lawyer: lawyerId,
        },
        async (rsp: any) => {
          if (rsp.success) {
            console.log(rsp.imp_uid);
            const token = parseCookies().accessToken;
            confirm("결제가 완료되었습니다.");

            setImpUid(rsp.imp_uid);

            const paymentData: IPayment = {
              impUid: rsp.imp_uid,
              amount: amount,
              status: "PENDING",
              buyer: {
                id: userId,
              },
              product: {
                id: selectedProductId || 0,
              },
              lawyer: lawyerId,
            };
            dispatch(savePayment(paymentData));
            await axios.post(
              `${userURL}/user/payments/verifyIamport/${rsp.imp_uid}`,
              rsp,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } else {
            console.log("Payment failed", rsp.error_msg);
            confirm("결제가 실패하였습니다.");
          }
        }
      );
    } else {
      console.log("결제가 취소되었습니다.");
    }
  };

  const findLawyerDetailById = async () => {
    await dispatch(getLawyerById(lawyerId)).then((response: any) => {
      console.log(response);
      setLawyer(response.payload);
      setLawyerDetail(response.payload.detail);
    });
  };

  // Fetch products data from API
  const loadProducts = async () => {
    try {
      const token = parseCookies().accessToken;
      const response = await axios.get(`${userURL}/product/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("Products data is not an array", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    findLawyerDetailById();
    loadProducts();
    const jquery = document.createElement("script");
    jquery.src = "http://code.jquery.com/jquery-1.12.4.min.js";
    const iamport = document.createElement("script");
    iamport.src = "http://cdn.iamport.kr/js/iamport.payment-1.1.7.js";
    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  const consultingButton = (
    <>
      <button
        className="bg-[var(--color-Harbor-first)] text-[var(--color-Harbor-firth)] h-[5vh] w-[22vw]"
        onClick={() => {
          setConsultation(true);
          if (consultation) {
            // 상담 결제하기
            requestPay(amount);
          }
        }}
      >
        상담 결제하기
      </button>
    </>
  );

  const lawyerPageButton = (
    <>
      <button
        className="bg-[var(--color-Harbor-first)] text-[var(--color-Harbor-firth)] h-[5vh] w-[22vw]"
        onClick={() => window.location.replace(`/lawyers`)}
      >
        변호사 페이지로 돌아가기
      </button>
    </>
  );

  return (
    <>
      <div className="w-[1400px] relative">
        <div className="w-[850px] mt-40 p-10">
          <h1 className="text-5xl leading-relaxed font-bold pb-20">
            많은 사건 경험과 노하우를 가진 든든한 조력자
          </h1>
          <div className="h-[240px] flex flex-row justify-between w-[723px] border-b">
            <div className="">
              <p className="font-bold text-lg">{lawyer.name} 변호사</p>
              <div className="my-2">{lawyer.email}</div>
              <div className="py-5">
                <p className="font-semibold">{lawyerDetail.belong}</p>
                <p className="font-normal">
                  {lawyerDetail.address} {lawyerDetail.addressDetail}
                </p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <p className="font-semibold">사무실 전화</p>
                <p>{lawyerDetail.belongPhone}</p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <p className="font-semibold">본인 전화</p>
                <p>{lawyer.phone}</p>
              </div>
            </div>
            <div className="w-[360px] flex flex-col gap-2">
              <div className="flex flex-row gap-4">
                <div className="font-semibold">분야</div>
                <div className="flex flex-row gap-2 font-normal">
                  {lawyerDetail.law?.map((law: any) => (
                    <div key={law} className="flex flex-row justify-between">
                      <p>{law}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <p className="font-semibold">자격</p>
                <p>{lawyer.lawyerNo}</p>
              </div>
              <div className="flex flex-row gap-4">
                <p className="font-semibold">학력</p>
                <p>
                  {lawyerDetail.university} {lawyerDetail.major}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[498px] absolute top-0 right-10 py-[16px]">
          <div className="h-[14vh] bg-[var(--color-Harbor-first)] text-[var(--color-Harbor-firth)] p-9 py-7 rounded-t-xl">
            <div className="flex flex-col gap-2">
              <p className=" text-3xl font-bold">{lawyer.name} 변호사</p>
              <p className=" text-lg">{lawyerDetail.belong} 회사</p>
            </div>
          </div>
          <div className="h-[58vh] items-center flex justify-center z-20">
            <Image
              src={
                lawyerDetail.photo ||
                "https://img.icons8.com/?size=100&id=11730&format=png&color=000000"
              }
              className="mb-3"
              width={420}
              height={420}
              alt="lawyer-image"
            />
          </div>
          <div className="rounded-xl shadow-2xl fixed bottom-5 p-5 flex flex-col items-center gap-3 bg-white z-40">
            {isModalOpen && !consultation && (
              <>
                <div className="flex flex-col justify-center">
                  <div
                    className="h-[5vh] w-[22vw] flex flex-row justify-between gap-2 p-3 px-5 border-b"
                    onClick={() =>
                      setSelectedOpen({
                        ...selectedOpen,
                        consultationType: !selectedOpen.consultationType,
                      })
                    }
                  >
                    <p>상담 종류 선택</p>
                    <Image
                      src={
                        selectedOpen.consultationType
                          ? "https://img.icons8.com/?size=100&id=86235&format=png&color=1A1A1A"
                          : "https://img.icons8.com/?size=100&id=85327&format=png&color=1A1A1A"
                      }
                      width={20}
                      height={20}
                      alt="arrow-right"
                      className="z-20"
                    />
                  </div>
                  {selectedOpen.consultationType && (
                    <>
                      <div className="flex flex-row p-2 text-sm gap-2">
                        {products.map((product) => (
                          <input
                            key={product.id}
                            type="button"
                            className={`${
                              amount === product.price
                                ? "bg-[var(--color-Harbor-sec)] text-white"
                                : ""
                            } p-3 rounded-lg border cursor-pointer`}
                            onClick={() => {
                              setSelectedProductId(product.id);
                              setAmount(product.price);
                              setconsultingType(product.item_name);
                            }}
                            value={product.item_name}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  <div
                    className="h-[5vh] w-[22vw] flex flex-row justify-between gap-2 p-3 px-5 border-b"
                    onClick={() =>
                      setSelectedOpen({
                        ...selectedOpen,
                        date: !selectedOpen.date,
                      })
                    }
                  >
                    <p>날짜 선택</p>
                    <Image
                      src={
                        selectedOpen.date
                          ? "https://img.icons8.com/?size=100&id=86235&format=png&color=1A1A1A"
                          : "https://img.icons8.com/?size=100&id=85327&format=png&color=1A1A1A"
                      }
                      width={20}
                      height={20}
                      alt="arrow-right"
                      className="z-20"
                    />
                  </div>
                  {selectedOpen.date && (
                    <>
                      <div className="flex flex-row p-2 text-sm gap-2">
                        {dateType.map((type) => (
                          <input
                            key={type.type}
                            type="button"
                            className={`${
                              date === type.type
                                ? "bg-[var(--color-Harbor-sec)] text-white"
                                : ""
                            } p-3 rounded-lg border cursor-pointer`}
                            onClick={() => {
                              setDate(type.type);
                            }}
                            value={type.type}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  <div
                    className="h-[5vh] w-[22vw] flex flex-row justify-between gap-2 p-3 px-5 border-b"
                    onClick={() =>
                      setSelectedOpen({
                        ...selectedOpen,
                        time: !selectedOpen.time,
                      })
                    }
                  >
                    <p>시간 선택</p>
                    <Image
                      src={
                        selectedOpen.time
                          ? "https://img.icons8.com/?size=100&id=86235&format=png&color=1A1A1A"
                          : "https://img.icons8.com/?size=100&id=85327&format=png&color=1A1A1A"
                      }
                      width={20}
                      height={20}
                      alt="arrow-right"
                      className="z-20"
                    />
                  </div>
                  {selectedOpen.time && (
                    <>
                      <div className="flex flex-row p-2 text-sm gap-2">
                        {timeType.map((type) => (
                          <input
                            key={type.type}
                            type="button"
                            className={`${
                              time === type.type
                                ? "bg-[var(--color-Harbor-sec)] text-white"
                                : ""
                            } p-3 rounded-lg border cursor-pointer`}
                            onClick={() => {
                              setTime(type.type);
                            }}
                            value={type.type}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
            {isModalOpen && consultation && (
              <>
                <div className="flex flex-col items-baseline gap-2">
                  <SubmitIssuePage
                    lawyerId={lawyerId}
                    amount={amount}
                    consultingType={consultingType}
                    date={date}
                    time={time}
                  />
                </div>
              </>
            )}
            {!isModalOpen && !consultation && (
              <div className="flex flex-row justify-center">
                <div className="flex flex-col gap-2 items-center p-3 px-5 border-r">
                  <p>15분 전화 상담</p>
                  <p>{lawyerDetail.phoneCost} 원</p>
                </div>
                <div className="flex flex-col gap-2 items-center p-3 px-5 border-r">
                  <p>20분 영상 상담</p>
                  <p>{lawyerDetail.videoCost} 원</p>
                </div>
                <div className="flex flex-col gap-2 items-center p-3 px-5">
                  <p>30분 방문 상담</p>
                  <p>{lawyerDetail.visitCost} 원</p>
                </div>
              </div>
            )}
            {consultation && (
              <button
                className="bg-[var(--color-Harbor-first)] text-[var(--color-Harbor-firth)] h-[5vh] w-[22vw] mx-2"
                onClick={() => setConsultation(false)}
              >
                이전으로 돌아가기
              </button>
            )}
            {isModalOpen && consultingButton}
            {!consultation && (
              <button
                className="bg-[var(--color-Harbor-first)] text-[var(--color-Harbor-firth)] h-[5vh] w-[22vw] mx-2"
                onClick={() => setIsModalOpen(!isModalOpen)}
              >
                {isModalOpen ? "이전으로 돌아가기" : "상담 예약하기"}
              </button>
            )}
            {!isModalOpen && lawyerPageButton}
          </div>
        </div>
      </div>
    </>
  );
};

export default LawyerByIdPage;
