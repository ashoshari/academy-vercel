// import 
// export const RenderExam = () => {
//   const currentQuestion = currentExam.questions[currentQuestionIndex];
//   const progress =
//     ((currentQuestionIndex + 1) / currentExam.questions.length) * 100;

//   return (
//     <div className="bg-white rounded-2xl shadow-lg p-8">
//       {/* Exam Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">
//             {currentExam.title}
//           </h2>
//           <p className="text-gray-600">
//             السؤال {currentQuestionIndex + 1} من {currentExam.questions.length}
//           </p>
//         </div>
//         <div className="text-center">
//           <div
//             className={`text-3xl font-bold mb-2 ${
//               timeRemaining < 300 ? "text-red-600" : "text-blue-600"
//             }`}
//           >
//             {/* {formatDateTimeSimple(timeRemaining)} */}
//           </div>
//           <div className="text-sm text-gray-500">الوقت المتبقي</div>
//         </div>
//       </div>

//       {/* Progress Bar */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
//           <span>التقدم</span>
//           <span>{Math.round(progress)}%</span>
//         </div>
//         <div className="w-full bg-gray-200 rounded-full h-3">
//           <div
//             className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
//             style={{ width: `${progress}%` }}
//           ></div>
//         </div>
//       </div>

//       {/* Question */}
//       <div className="mb-8">
//         <h3 className="text-xl font-semibold text-gray-900 mb-6">
//           {currentQuestion.question}
//         </h3>
//         <div className="space-y-3">
//           {currentQuestion.options.map((option: any, index: any) => (
//             <button
//               key={index}
//               onClick={() => handleAnswerSelect(currentQuestion.id, index)}
//               className={`w-full p-4 text-right rounded-xl border-2 transition-all duration-200 ${
//                 selectedAnswers[currentQuestion?.id] === index
//                   ? "border-blue-500 bg-blue-50 text-blue-900"
//                   : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
//               }`}
//             >
//               <div className="flex items-center space-x-3">
//                 <div
//                   className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                     selectedAnswers[currentQuestion.id] === index
//                       ? "border-blue-500 bg-blue-500"
//                       : "border-gray-300"
//                   }`}
//                 >
//                   {selectedAnswers[currentQuestion.id] === index && (
//                     <div className="w-3 h-3 bg-white rounded-full"></div>
//                   )}
//                 </div>
//                 <span className="flex-1 font-medium">{option}</span>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="flex items-center justify-between">
//         <button
//           onClick={() =>
//             setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))
//           }
//           disabled={currentQuestionIndex === 0}
//           className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
//         >
//           <ChevronRight className="w-5 h-5" />
//           <span>السابق</span>
//         </button>

//         <div className="text-center">
//           <div className="text-sm text-gray-600 mb-2">
//             تم الإجابة على {Object.keys(selectedAnswers).length} من{" "}
//             {currentExam.questions.length} أسئلة
//           </div>
//         </div>

//         {currentQuestionIndex === currentExam.questions.length - 1 ? (
//           <button
//             onClick={handleExamSubmit}
//             className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
//           >
//             <CheckCircle className="w-5 h-5" />
//             <span>تسليم الامتحان</span>
//           </button>
//         ) : (
//           <button
//             onClick={() =>
//               setCurrentQuestionIndex(
//                 Math.min(
//                   currentExam.questions.length - 1,
//                   currentQuestionIndex + 1
//                 )
//               )
//             }
//             className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 flex items-center space-x-2"
//           >
//             <span>التالي</span>
//             <ChevronLeft className="w-5 h-5" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };
