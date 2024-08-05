"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

const NewsBoardPage = () => {
  const router = useRouter();
  return (
    <>
      <div
        className={`flex flex-col justify-center items-center relative font-chosunlo`}
      >
        <div className="flex flex-col items-center py-24">
          <h1 className=" text-5xl font-semibold">NEWS BOARD</h1>
          <div className="flex flex-wrap items-center justify-center w-[60vw] box-border gap-8 py-7">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <div
                key={item}
                className="flex flex-row items-center border rounded-md border-[var(--color-Harbor-sec)] w-[60vw] h-[25vh] p-8 gap-8"
                onClick={() => router.push(`/news/${item}`)}
              >
                <Image
                  src="https://img.etoday.co.kr/pto_db/2024/04/600/20240419110132_2014644_647_358.jpg"
                  alt="news-image"
                  width={300}
                  height={200}
                />
                <div className="flex flex-col items-baseline gap-3 w-[40vw] h-[15vh]">
                  <div className="flex flex-row items-baseline justify-between w-[37vw]">
                    <h1 className="text-3xl font-medium font-chosunkg truncate">
                      꽁꽁 얼어붙은 한강 위로 고양이가 걸어다닙니다.
                    </h1>
                    <p className="text-base font-extralight font-chosunsg">
                      2000.00.00
                    </p>
                  </div>
                  <p className="text-lg font-normal font-chosunsg line-clamp-3">
                    꽁꽁 얼어붙은 한강 위로 고양이가 걸어다닙니다.꽁꽁 얼어붙은
                    한강 위로 고양이가 걸어다닙니다.꽁꽁 얼어붙은 한강 위로
                    고양이가 걸어다닙니다.꽁꽁 얼어붙은 한강 위로 고양이가
                    걸어다닙니다.꽁꽁 얼어붙은 한강 위로 고양이가
                    걸어다닙니다.꽁꽁 얼어붙은 한강 위로 고양이가
                    걸어다닙니다.꽁꽁 얼어붙은 한강 위로 고양이가
                    걸어다닙니다.꽁꽁 얼어붙은 한강 위로 고양이가 걸어다닙니다.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsBoardPage;
