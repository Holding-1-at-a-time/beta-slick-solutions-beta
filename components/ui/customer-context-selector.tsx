"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface CustomerContextSelectorProps {
  orgId: string
  onSelect: (customerId: string) => void
}

export function CustomerContextSelector({ orgId, onSelect }: CustomerContextSelectorProps) {
  const [open, setOpen] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        // In a real implementation, this would fetch customers from the API
        // For now, we'll use mock data
        const mockCustomers = [
          { id: "1", name: "John Doe", email: "john@example.com" },
          { id: "2", name: "Jane Smith", email: "jane@example.com" },
          { id: "3", name: "Bob Johnson", email: "bob@example.com" },
        ]
        setCustomers(mockCustomers)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching customers:", error)
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [orgId])

  const handleSelect = (customerId: string) => {
    setSelectedCustomer(customerId)
    onSelect(customerId)
    setOpen(false)
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Customer</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {selectedCustomer ? customers.find((c) => c.id === selectedCustomer)?.name : "Select customer..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search customers..." />
            <CommandList>
              <CommandEmpty>No customer found.</CommandEmpty>
              <CommandGroup>
                {customers.map((customer) => (
                  <CommandItem key={customer.id} value={customer.id} onSelect={() => handleSelect(customer.id)}>
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedCustomer === customer.id ? "opacity-100" : "opacity-0")}
                    />
                    <div>
                      <p>{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
