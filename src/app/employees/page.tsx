"use client"

import { useState } from "react"
import { DataTable, DataTableColumn } from "@/components/crud/data-table"
import { useEmployeesList, useDeleteEmployee } from "@/hooks/useEmployees"
import { Employee } from "@/types/models"
import { Badge } from "@/components/ui/badge"
import { CrudListParams } from "@/hooks/useCrud"

const columns: DataTableColumn<Employee>[] = [
  {
    key: "fornavn",
    label: "Fornavn",
    sortable: true,
  },
  {
    key: "etternavn",
    label: "Etternavn",
    sortable: true,
  },
  {
    key: "tittel",
    label: "Tittel",
    sortable: true,
    render: (value) => value || "-"
  },
  {
    key: "avdeling",
    label: "Avdeling",
    sortable: true,
    render: (value) => value || "-"
  },
  {
    key: "e_postjobb",
    label: "E-post",
    render: (value) => value ? (
      <a href={`mailto:${value}`} className="text-blue-600 hover:underline">
        {value}
      </a>
    ) : "-"
  },
  {
    key: "tlfprivat",
    label: "Telefon",
    render: (value) => value || "-"
  },
  {
    key: "sluttet",
    label: "Status",
    render: (value) => (
      <Badge variant={!value ? "default" : "secondary"}>
        {!value ? "Aktiv" : "Sluttet"}
      </Badge>
    )
  },
]

export default function EmployeesPage() {
  const [params, setParams] = useState({
    skip: 0,
    limit: 20,
    aktiv: true,
  })

  const { data, isLoading } = useEmployeesList(params)
  const deleteMutation = useDeleteEmployee()

  const handleParamsChange = (newParams: CrudListParams) => {
    setParams(prev => ({
      ...prev,
      skip: ((newParams.page ?? 1) - 1) * prev.limit,
      limit: newParams.page_size || prev.limit,
    }))
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ansatte</h1>
        <p className="text-muted-foreground">
          Administrer ansatte og deres informasjon
        </p>
      </div>

      <DataTable<Employee>
        tableName="employees"
        columns={columns}
        data={data?.items || []}
        total={data?.total || 0}
        page={data?.page || 1}
        pageSize={data?.page_size || 20}
        totalPages={data?.total_pages || 1}
        onParamsChange={handleParamsChange}
        onDelete={handleDelete}
        loading={isLoading}
        idField="ansattid"
      />
    </div>
  )
}