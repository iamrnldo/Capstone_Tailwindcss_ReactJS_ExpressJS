const RegisterPage = () => {
  return (
    <>
      <div className="w-[1440px] h-[1024px] relative bg-white overflow-hidden">
        <img
          className="w-56 h-40 left-[687px] top-[182px] absolute"
          src="https://placehold.co/218x153"
        />
        <div className="left-[843px] top-[206px] absolute justify-start text-sky-900 text-5xl font-bold font-['Poppins']">
          EduSukses
        </div>
        <div className="left-[791px] top-[447px] absolute justify-start text-black text-xl font-medium font-['Inter']">
          Daftar menggunakan e-mail:
        </div>
        <div className="left-[869px] top-[282px] absolute justify-start text-black text-xl font-normal font-['Inter']">
          Bangun kebiasaan belajar yang konsisten <br />
          dan hasil nyata lewat pengalaman interaktif.
        </div>
        <div className="w-[505px] px-32 py-3.5 left-[791px] top-[493px] absolute bg-sky-900 rounded-[5px] outline outline-[0.50px] outline-offset-[-0.50px] inline-flex flex-col justify-start items-start gap-2.5">
          <div className="self-stretch h-7 relative">
            <img
              className="w-8 h-7 left-0 top-0 absolute rounded-[360px]"
              src="https://placehold.co/31x30"
            />
            <div className="w-48 h-6 left-[46px] top-[1.95px] absolute text-center justify-center text-white text-xl font-normal font-['Inter']">
              Register with google
            </div>
          </div>
        </div>
        <div className="py-2.5 left-[791px] top-[583px] absolute inline-flex justify-center items-center gap-2.5">
          <div className="justify-start">
            <span class="text-black text-xl font-normal font-['Inter']">
              Sudah punya akun?
            </span>
            <span class="text-sky-900 text-xl font-normal font-['Inter']">
              {" "}
            </span>
            <span class="text-sky-900 text-xl font-normal font-['Inter'] underline">
              Masuk di sini
            </span>
          </div>
        </div>
        <img
          className="w-96 h-96 left-[186px] top-[307px] absolute"
          src="https://placehold.co/450x450"
        />
        <img
          className="w-[501px] h-[501px] left-[290px] top-[335px] absolute"
          src="https://placehold.co/501x501"
        />
        <img
          className="w-96 h-96 left-[66px] top-[178px] absolute"
          src="https://placehold.co/449x449"
        />
      </div>
    </>
  );
};

export default RegisterPage;