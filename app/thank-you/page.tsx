export default function ThankYouPage() {

  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-pink-500
        to-rose-500
        text-white
        p-4
      "
    >

      <div
        className="
          bg-white/10
          backdrop-blur-xl
          border
          border-white/20
          rounded-[32px]
          p-10
          text-center
          max-w-md
          w-full
        "
      >

        <div className="text-6xl mb-5">
          🚖
        </div>

        <h1
          className="
            text-4xl
            font-black
            mb-3
          "
        >
          Thank You
        </h1>

        <p
          className="
            text-white/80
            text-lg
          "
        >
          Your cab booking has been
          received successfully.
        </p>

        <p
          className="
            text-white/70
            text-sm
            mt-4
          "
        >
          Driver will contact you soon.
        </p>

      </div>
    </div>
  );
}