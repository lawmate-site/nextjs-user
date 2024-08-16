"use client";

import { ILawyerPost } from "@/components/_model/lawyer/lawyer";
import { createPost } from "@/components/_service/lawyer/lawyer.service";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import { useDispatch } from "react-redux";

const ColumnBoardAddPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const accessToken: string = parseCookies().accessToken;
  const [decodedToken, setDecodedToken] = useState({} as any);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [selectBoard, setSelectBoard] = useState({
    lawyerId: "",
    post: {} as ILawyerPost,
    files: [] as File[],
  });

  // const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: any) => {
    // setInputValue(event.target.value);
    setSelectBoard({
      ...selectBoard,
      post: { ...selectBoard.post, category: event.target.value },
    });
  };

  // const handleHashtagAdd = () => {
  //   if (inputValue.trim() !== "") {
  //     setSelectBoard({
  //       ...selectBoard,
  //       tag: [...selectBoard.tag, { value: inputValue }], // Create a new object with the value
  //     });
  //     setInputValue("");
  //   }
  // };

  // const handleHashtagRemove = (index: any) => {
  //   setSelectBoard({
  //     ...selectBoard,
  //     tag: selectBoard.tag.filter((_: any, i: any) => i !== index),
  //   });
  // };

  const submit = async () => {
    if (!selectBoard.files || selectBoard.files.length === 0) {
      alert("파일을 선택해주세요.");
      return;
    }

    try {
      const response = await dispatch(
        createPost({
          lawyerId: selectBoard.lawyerId,
          post: selectBoard.post,
          files: selectBoard.files,
        })
      );
      console.log(response);

      if (response.meta.requestStatus === "fulfilled") {
        alert("파일이 성공적으로 등록되었습니다.");
        router.push("/"); // 원하는 페이지로 리다이렉트
      }
    } catch (error) {
      console.log("Post creation error:", error);
    }
  };

  useEffect(() => {
    if (!accessToken) {
      return; // or handle the case where there's no token
    }
    setIsLoggedIn(!!accessToken);
    try {
      setDecodedToken(jwtDecode(accessToken));
      if (decodedToken.roles !== undefined) {
        console.log(decodedToken);
        setSelectBoard({ ...selectBoard, lawyerId: decodedToken.id });
      }
    } catch (error) {
      console.log(error);
    }
  }, [isLoggedIn]);

  return (
    <>
      <div className="flex flex-col items-center pt-20">
        <div className=" border border-black w-[50vw] p-10">
          <div>
            <h1 className=" text-3xl border-b-2 p-4">법률상담 질문하기</h1>
          </div>
          <div className="flex flex-row items-center justify-between mt-3">
            <p className="text-xl">제목</p>
            <input
              type="text"
              placeholder="제목을 입력하세요."
              className="w-[42vw] border border-black rounded-xl h-[44px] px-4 focus:outline-none"
              onChange={(event: any) =>
                setSelectBoard({
                  ...selectBoard,
                  post: { ...selectBoard.post, title: event.target.value },
                })
              }
            />
          </div>
          <div className="flex flex-row items-center justify-between mt-3 pb-2">
            <p className="text-xl">카테고리</p>
            <input
              type="text"
              onChange={handleInputChange}
              placeholder="카테고리를 입력하세요"
              className="w-10/12 p-2"
            />
            {/* <button onClick={handleHashtagAdd}>추가</button> */}
          </div>
          {/* <div className="flex flex-row items-center gap-5">
            {selectBoard.tag.map((hashtag: any, index: any) => (
              <span
                key={index}
                className="flex flex-row gap-3 items-center px-2 rounded-lg bg-[var(--color-Harbor-third)] text-[var(--color-Harbor-first)] border border-[var(--color-Harbor-first)]"
              >
                # {hashtag.value}
                <Image
                  src={
                    "https://img.icons8.com/?size=100&id=OpfeY8fFZX2F&format=png&color=354649"
                  }
                  onClick={() => handleHashtagRemove(index)}
                  alt={"x"}
                  width={20}
                  height={20}
                  className="w-4 h-4"
                />
              </span>
            ))}
          </div> */}
          <div className="flex items-center justify-center align-middle mt-3">
            <input
              type="file"
              className="w-[42vw] h-[44px] focus:outline-none"
              onChange={(event: any) =>
                setSelectBoard({ ...selectBoard, files: event.target.value })
              }
              multiple
            />
          </div>
          <textarea
            placeholder="내용을 입력하세요."
            className=" mt-4 border border-black rounded-lg w-[45vw] h-[50vh] px-4 focus:outline-none p-4"
            onChange={(event: any) =>
              setSelectBoard({
                ...selectBoard,
                post: { ...selectBoard.post, content: event.target.value },
              })
            }
          ></textarea>
          <input
            type="submit"
            value="제출하기"
            className="mt-4 bg-black text-white w-[45vw] h-[44px] rounded-xl"
            onClick={submit}
          />
        </div>
      </div>
    </>
  );
};

export default ColumnBoardAddPage;
