const LawyerColumnPage = () => {
  return (
    <>
      <div
        className={`flex flex-col justify-center items-center relative font-chosunlo`}
      >
        <div className="flex flex-col items-center py-16">
          <h1 className=" text-[40px] font-semibold">변호사 법률 칼럼</h1>

          <div className="flex flex-row items-center border rounded-md border-[var(--color-Harbor-sec)] w-[60vw] h-[25vh] p-8 gap-8"></div>
          <div className="grid grid-cols-2 items-center justify-center w-[60vw] box-border gap-8 py-7">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
              <div
                key={item}
                className="flex flex-col border rounded-md border-[var(--color-Harbor-sec)] w-[29vw] h-[25vh] p-8 gap-8"
              >
                <div>Q</div>
                <div>A</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LawyerColumnPage;
