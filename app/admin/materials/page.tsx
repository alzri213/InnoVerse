"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface Material {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration_minutes: number
}

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    category: "RPL",
    difficulty: "Beginner",
    duration_minutes: 60,
  })
  const [editMaterial, setEditMaterial] = useState({
    title: "",
    description: "",
    category: "RPL",
    difficulty: "Beginner",
    duration_minutes: 60,
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if user is admin
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData?.role !== "admin") {
        router.push("/dashboard")
        return
      }

      // Fetch materials
      const { data: materialsData } = await supabase.from("materials").select("*")

      setMaterials(materialsData || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleAddMaterial = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from("materials")
      .insert([
        {
          ...newMaterial,
          created_by: user.id,
        },
      ])
      .select()

    if (!error && data) {
      setMaterials([...materials, data[0]])
      setNewMaterial({
        title: "",
        description: "",
        category: "RPL",
        difficulty: "Beginner",
        duration_minutes: 60,
      })
      setIsAdding(false)
    }
  }

  const handleEditMaterial = (material: Material) => {
    setEditingId(material.id)
    setEditMaterial({
      title: material.title,
      description: material.description,
      category: material.category,
      difficulty: material.difficulty,
      duration_minutes: material.duration_minutes,
    })
    setIsAdding(true)
  }

  const handleUpdateMaterial = async () => {
    if (!editingId) return

    const { data, error } = await supabase
      .from("materials")
      .update(editMaterial)
      .eq("id", editingId)
      .select()

    if (!error && data) {
      setMaterials(materials.map((m) => (m.id === editingId ? data[0] : m)))
      setEditingId(null)
      setEditMaterial({
        title: "",
        description: "",
        category: "RPL",
        difficulty: "Beginner",
        duration_minutes: 60,
      })
      setIsAdding(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditMaterial({
      title: "",
      description: "",
      category: "RPL",
      difficulty: "Beginner",
      duration_minutes: 60,
    })
    setIsAdding(false)
  }

  const handleDeleteMaterial = async (id: string) => {
    await supabase.from("materials").delete().eq("id", id)
    setMaterials(materials.filter((m) => m.id !== id))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading materials...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/admin">
            <h1 className="text-2xl font-bold cursor-pointer">
              <span className="text-primary">Inno</span>
              <span className="text-accent">Verse</span>
            </h1>
          </Link>
          <Link href="/admin">
            <Button variant="outline">Kembali ke Admin</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Kelola Materi Pembelajaran</h2>
          <Button onClick={() => editingId ? handleCancelEdit() : setIsAdding(!isAdding)} className="bg-primary hover:bg-primary-dark text-background w-full sm:w-auto">
            {isAdding ? "Batal" : "+ Tambah Materi"}
          </Button>
        </div>

        {/* Add/Edit Material Form */}
        {isAdding && (
          <div className="mb-8 p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border">
            <h3 className="text-xl font-bold mb-4 text-foreground">
              {editingId ? "Edit Materi" : "Tambah Materi Baru"}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Judul</label>
                <Input
                  value={editingId ? editMaterial.title : newMaterial.title}
                  onChange={(e) => editingId
                    ? setEditMaterial({ ...editMaterial, title: e.target.value })
                    : setNewMaterial({ ...newMaterial, title: e.target.value })
                  }
                  placeholder="Judul materi"
                  className="bg-input border-border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Deskripsi</label>
                <textarea
                  value={editingId ? editMaterial.description : newMaterial.description}
                  onChange={(e) => editingId
                    ? setEditMaterial({ ...editMaterial, description: e.target.value })
                    : setNewMaterial({ ...newMaterial, description: e.target.value })
                  }
                  placeholder="Deskripsi materi"
                  className="w-full p-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori</label>
                  <select
                    value={editingId ? editMaterial.category : newMaterial.category}
                    onChange={(e) => editingId
                      ? setEditMaterial({ ...editMaterial, category: e.target.value })
                      : setNewMaterial({ ...newMaterial, category: e.target.value })
                    }
                    className="w-full p-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>RPL</option>
                    <option>DKV</option>
                    <option>TKJ</option>
                    <option>TRANS/TELKO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tingkat Kesulitan</label>
                  <select
                    value={editingId ? editMaterial.difficulty : newMaterial.difficulty}
                    onChange={(e) => editingId
                      ? setEditMaterial({ ...editMaterial, difficulty: e.target.value })
                      : setNewMaterial({ ...newMaterial, difficulty: e.target.value })
                    }
                    className="w-full p-2 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Durasi (menit)</label>
                <Input
                  type="number"
                  value={editingId ? editMaterial.duration_minutes : newMaterial.duration_minutes}
                  onChange={(e) =>
                    editingId
                      ? setEditMaterial({ ...editMaterial, duration_minutes: Number.parseInt(e.target.value) })
                      : setNewMaterial({ ...newMaterial, duration_minutes: Number.parseInt(e.target.value) })
                  }
                  className="bg-input border-border"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={editingId ? handleUpdateMaterial : handleAddMaterial} className="flex-1 bg-primary hover:bg-primary-dark text-background">
                  {editingId ? "Update Materi" : "Simpan Materi"}
                </Button>
                {editingId && (
                  <Button onClick={handleCancelEdit} variant="outline" className="flex-1">
                    Batal Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Materials List */}
        <div className="space-y-4">
          {materials.map((material) => (
            <div
              key={material.id}
              className="p-4 sm:p-6 rounded-lg bg-gradient-to-br from-muted/20 to-muted/5 border border-border flex flex-col lg:flex-row justify-between items-start gap-4"
            >
              <div className="flex-1 w-full">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{material.title}</h3>
                <p className="text-muted-foreground mb-3 text-sm sm:text-base">{material.description}</p>
                <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span>{material.category}</span>
                  <span>{material.difficulty}</span>
                  <span>{material.duration_minutes} min</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 w-full lg:w-auto lg:ml-4">
                <Button
                  onClick={() => handleEditMaterial(material)}
                  variant="outline"
                  className="flex-1 lg:flex-initial text-primary border-primary hover:bg-primary/10"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDeleteMaterial(material.id)}
                  variant="outline"
                  className="flex-1 lg:flex-initial text-error border-error hover:bg-error/10"
                >
                  Hapus
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
