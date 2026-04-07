// import {
//   ChevronDown,
//   ChevronUp,
//   FolderTree,
//   Folder,
//   User,
//   Monitor,
//   Calendar,
//   ToggleRight,
//   ToggleLeft,
//   Clock,
// } from "lucide-react";
// import { useState } from "react";
// const PatchsSection = () => {
//   const [isExpanded, setIsExpanded] = useState(true);
//   return (
//     <div className="bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-orange-100/50">
//       <button
//         onClick={() => setIsExpanded(!isExpanded)}
//         className="cursor-pointer p-6 hover:bg-gray-50 w-full flex justify-between"
//       >
//         <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//           <FolderTree className="w-5 h-5 text-orange-600" />
//           مجموعات الكودات مع الاستهداف ومعلومات الأمان
//         </h2>
//         {isExpanded ? <ChevronDown /> : <ChevronUp />}
//       </button>
//       <div
//         className={`
//     overflow-hidden transition-all duration-500 ease-in-out
//     ${
//       isExpanded &&
//       !(!cardCodes?.data?.data || cardCodes?.data?.data?.length === 0)
//         ? `max-h-[1000px] overflow-y-auto opacity-100 p-6`
//         : "max-h-0 opacity-0"
//     }
//   `}
//       >
//         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//           {cardCodes?.data?.data?.map((batch: any) => {
//             const targeting = getTargetingDisplay(
//               batch.subsubsections,
//               "specific"
//             );
//             // batch.targetingType

//             return (
//               <div
//                 key={batch.id}
//                 className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
//               >
//                 {/* Header */}
//                 <div className="bg-gradient-to-r from-(--brand) to-(--brand-light) p-4 text-white">
//                   <div className="flex items-center justify-between mb-2">
//                     <h3 className="font-bold text-lg">{batch?.name || "-"}</h3>
//                     <div className="flex justify-center items-center gap-1">
//                       {/* Installment */}
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           batch?.card?.is_installment &&
//                           "bg-green-400/20 text-green-100"
//                         }`}
//                       >
//                         {batch?.is_installment && "أقساط"}
//                       </span>
//                       {/* Active */}
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           batch.card.is_active
//                             ? "bg-green-400/20 text-green-100"
//                             : "bg-red-400/20 text-red-100"
//                         }`}
//                       >
//                         {batch?.is_active ? "مفعل" : "معطل"}
//                       </span>
//                     </div>
//                   </div>
//                   <div className="text-2xl font-bold">
//                     {batch?.card?.price} د.أ
//                   </div>
//                 </div>

//                 {/* Targeting Info */}
//                 <div className="flex flex-col justify-center items-center p-4 bg-gradient-to-r from-blue-50 to-orange-50 h-22">
//                   <div className="flex items-center gap-2 text-sm">
//                     <targeting.icon size={16} className={targeting.color} />
//                     <span className={`font-medium ${targeting.color}`}>
//                       الأقسام المحددة: {batch.subsubsections.length}
//                     </span>
//                   </div>
//                   {/* {batch.targetingType === "specific" && */}
//                   {batch?.subsubsections?.length >= 1 && (
//                     <div className="mt-2 flex flex-wrap gap-1">
//                       {batch?.subsubsections?.slice(0, 3).map((sec: any) => (
//                         <span
//                           key={sec.id}
//                           className="inline-flex items-center gap-1 px-2 py-1 bg-white/60 rounded-full text-xs"
//                         >
//                           <Folder size={10} />
//                           {sec.title}
//                         </span>
//                       ))}
//                       {batch?.subsubsections?.length > 3 && (
//                         <span className="px-2 py-1 bg-white/60 rounded-full text-xs">
//                           +{batch?.subsubsections?.length - 3} أخرى
//                         </span>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Stats */}
//                 <div className="p-4 bg-gray-50">
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-gray-800">
//                         {batch.total_generated_codes}
//                       </div>
//                       <div className="text-gray-600">إجمالي</div>
//                     </div>
//                     <div className="text-center">
//                       <div className="text-2xl font-bold text-red-600">
//                         {batch.total_used_generated_codes}
//                       </div>
//                       <div className="text-gray-600">مستخدم</div>
//                     </div>
//                   </div>
//                   <div className="mt-3">
//                     <div className="flex justify-between text-sm text-gray-600 mb-1">
//                       <span>معدل الاستخدام</span>
//                       <span>{Math.round(batch.avg_usage * 100)}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className="bg-(--brand) h-2 rounded-full transition-all duration-300"
//                         style={{
//                           width: `${batch.avg_usage * 100}%`,
//                         }}
//                       ></div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Security Info */}
//                 <div className="p-4 space-y-3">
//                   <div className="flex items-center gap-2 text-sm">
//                     <User className="w-4 h-4 text-gray-400" />
//                     <div>
//                       <span className="font-medium text-gray-800">
//                         {batch.generated_by.name}
//                       </span>
//                       <span className="text-gray-500 text-xs block">
//                         {batch.generated_by.type.name}
//                       </span>
//                     </div>
//                   </div>
//                   {/* Location */}
//                   {/* <div className="flex items-center gap-2 text-sm">
//                       <MapPin className="w-4 h-4 text-gray-400" />
//                       <span className="text-gray-600 font-mono text-xs">
//                         {batch?.security_information?.ip || "-"}
//                       </span>
//                     </div> */}

//                   {/* Device Info */}
//                   <div className="flex items-center gap-2 text-sm">
//                     <Monitor className="w-4 h-4 text-gray-400" />
//                     <span>
//                       {/* {batch?.security_information?.device?.vendor}
//                         {" - "}
//                         {batch?.security_information?.device?.model}
//                         {" - "}
//                         {batch?.security_information?.device?.type}
//                         {" - "} */}
//                       {batch?.security_information?.browser?.name}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-2 text-sm">
//                     <Calendar className="w-4 h-4 text-gray-400" />
//                     <span className="text-gray-600">
//                       {formatDate(batch.created_at)}
//                     </span>
//                   </div>

//                   {batch.updated_at && (
//                     <div className="pt-2 border-t border-gray-200">
//                       <div className="flex items-center gap-2 text-xs text-gray-500">
//                         <Clock className="w-3 h-3" />
//                         <span>
//                           آخر تعديل: {formatDate(batch.updated_at)}{" "}
//                           {/* بواسطة {batch.updated_at} */}
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex flex-col gap-y-[10px] min-h-20 overflow-y-auto">
//                     {batch.note && (
//                       <div className="bg-blue-50 p-3 rounded-lg">
//                         <div className="text-xs text-(--brand-secondary) font-medium mb-1">
//                           ملاحظات:
//                         </div>
//                         <div className="text-sm text-(--brand-secondary) mb-4 break-words">
//                           {batch.note}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 {role === "admin" && (
//                   <div className="p-4 border-t border-gray-200 flex items-center justify-between">
//                     <button
//                       onClick={() => toggleBatchStatus(batch.id)}
//                       className={`cursor-pointer p-2 rounded-lg transition-colors ${
//                         batch.is_active
//                           ? "text-green-600 bg-green-50 hover:bg-green-100"
//                           : "text-gray-400 bg-gray-50 hover:bg-gray-100"
//                       }`}
//                       title={
//                         batch.is_active ? "تعطيل المجموعة" : "تفعيل المجموعة"
//                       }
//                     >
//                       {batch.is_active ? (
//                         <ToggleRight size={20} />
//                       ) : (
//                         <ToggleLeft size={20} />
//                       )}
//                     </button>
//                     {/* <button
//                       onClick={() => handleBatchDownload(batch?.id)}
//                       className={`cursor-pointer p-1 rounded transition-colors ${
//                         batch.is_downloaded
//                           ? "text-(--brand-secondary) hover:bg-green-50"
//                           : "text-gray-400 hover:bg-gray-50"
//                       }`}
//                       title={"تحميل الكود"}
//                     >
//                       <Download size={16} />
//                     </button> */}

//                     {/* <button
//                       onClick={() => deleteBatch(batch.id)}
//                       className="cursor-pointer p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                       title="حذف المجموعة"
//                     >
//                       <Trash2 size={16} />
//                     </button> */}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//         <Pagination
//           count={cardCodes?.data?.pagination?.count}
//           currentPage={codePage}
//           onPageChange={setCodePage}
//         />
//       </div>
//     </div>
//   );
// };

// export default PatchsSection;
