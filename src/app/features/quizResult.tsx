"use client";

export const QuizResultView = ({ result, onBack }: any) => {
  return (
    <div className="pt-8 flex justify-center">
      <div className="w-full max-w-[520px] bg-white rounded-xl shadow-xl p-5 sm:p-6 mt-10">
        <div className="mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-black">
            Quiz Result
          </h2>
          <p className="text-sm text-gray-500 mt-1">{result.title}</p>
        </div>

        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3 mb-5">
          <p className="text-sm font-medium text-gray-700">Your Score</p>
          <p className="text-lg font-bold text-black">
            {result.score} / {result.total}
          </p>
        </div>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {result.answers?.map((a: any, i: number) => {
            const isCorrect = a.selected === a.correct;

            return (
              <div
                key={i}
                className={`border rounded-lg p-3 ${
                  isCorrect
                    ? "border-green-300 bg-green-50"
                    : "border-red-300 bg-red-50"
                }`}
              >
                <p className="font-medium text-black mb-1">
                  {i + 1}. {a.question}
                </p>

                <p className="text-sm text-gray-700">
                  Your answer:{" "}
                  <span
                    className={`font-medium ${
                      isCorrect ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {a.selected}
                  </span>
                </p>

                {!isCorrect && (
                  <p className="text-sm text-green-700 mt-1">
                    Correct answer:{" "}
                    <span className="font-medium">{a.correct}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={onBack}
          className="mt-6 w-full h-11 bg-black text-white rounded-lg hover:bg-gray-900 transition cursor-pointer"
        >
          Back
        </button>
      </div>
    </div>
  );
};
