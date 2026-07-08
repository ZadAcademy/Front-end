import LandingPage from "@/features/landing-page/landing-page"
import { Badge } from "@/shared/components/ui/badge"
import { Button } from "@/shared/components/ui/button"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/shared/components/ui/field"
import { useTranslations } from "next-intl"


export default function IndexPage() {
  const t = useTranslations('IndexPage');
  const button= useTranslations('IndexPage.button');
  return (
    <div>
     <LandingPage />


    </div>
  )
}

