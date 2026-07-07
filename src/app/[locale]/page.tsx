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
      <h1 className="">{t('title')}</h1>
      <p>=========================Button-Badge-checkbox Task/Sprint-1=========================</p>
      <div>

        <Button variant="primary">{button('submit')}</Button>
        <Button variant="primary" loading >{button('loading')}</Button>
        <Button variant="primary" loading >{button('loading')}</Button>
        <Button variant="secondary">{button('cancel')}</Button>
        <Button variant="destructive">{button('save')}</Button>
        <Button variant="ghost">{button('submit')}</Button>
        <Button variant="link">{button('submit')}</Button>
      </div>

      <div className="mt-10">

        <Badge variant="primary">{t('badge')}</Badge>
        <Badge variant="secondary">{t('badge')}</Badge>
        <Badge variant="destructive">{t('badge')}</Badge>
      </div>

      <div className="mt-10">
            <FieldGroup className="gap-3">
        <Field orientation="horizontal">
          <Checkbox
            id="finder-pref-9k2-hard-disks-ljj-checkbox"
            name="finder-pref-9k2-hard-disks-ljj-checkbox"
            defaultChecked
          />
          <FieldLabel
            htmlFor="finder-pref-9k2-hard-disks-ljj-checkbox"
            className="font-normal"
          >
            Hard disks
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="finder-pref-9k2-external-disks-1yg-checkbox"
            name="finder-pref-9k2-external-disks-1yg-checkbox"
            defaultChecked
          />
          <FieldLabel
            htmlFor="finder-pref-9k2-external-disks-1yg-checkbox"
            className="font-normal"
          >
            External disks
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="finder-pref-9k2-cds-dvds-fzt-checkbox"
            name="finder-pref-9k2-cds-dvds-fzt-checkbox"
          />
          <FieldLabel
            htmlFor="finder-pref-9k2-cds-dvds-fzt-checkbox"
            className="font-normal"
          >
            CDs, DVDs, and iPods
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Checkbox
            id="finder-pref-9k2-connected-servers-6l2-checkbox"
            name="finder-pref-9k2-connected-servers-6l2-checkbox"
          />
          <FieldLabel
            htmlFor="finder-pref-9k2-connected-servers-6l2-checkbox"
            className="font-normal"
          >
            Connected servers
          </FieldLabel>
        </Field>
      </FieldGroup>
      </div>


    </div>
  )
}

