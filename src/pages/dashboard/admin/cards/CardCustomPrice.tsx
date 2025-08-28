import CustomCardTable from "@/components/dashboard/admin/cards/CustomCardsTable";
import { User } from "@/services/auth";

export interface CustomCard {
  id: string;
  user: User;
  card: {
    id: string;
    price: string;
    is_active: boolean;
    default_teacher_price: string;
    default_library_price: string;
    created_at: string;
    updated_at: string;
  };
  price: string;
  created_at: string;
  updated_at: string;
}

export default function CardCustomPrice() {
  return <CustomCardTable />;
}
