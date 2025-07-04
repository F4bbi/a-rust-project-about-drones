import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface MessageFormData {
  chatId?: number
  password?: string
}

interface MessageFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: MessageFormData) => void
  messageType: 'join' | 'server-type' | string
}

const MessageForm: React.FC<MessageFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  messageType
}) => {
  const [formData, setFormData] = useState<MessageFormData>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateFormData = (field: keyof MessageFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getFormTitle = () => {
    switch (messageType) {
      case 'join':
        return 'Join Chat'
      case 'server-type':
        return 'Server Type Message'
      default:
        return 'Message Details'
    }
  }

  const getFormDescription = () => {
    switch (messageType) {
      case 'join':
        return 'Enter the chat ID and password to join the chat.'
      case 'server-type':
        return 'Server type messages don\'t require additional parameters.'
      default:
        return 'Fill in the required information for this message type.'
    }
  }

  const renderFormFields = () => {
    switch (messageType) {
      case 'join':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="chatId" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Chat ID
              </label>
              <input
                id="chatId"
                type="number"
                value={formData.chatId || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('chatId', parseInt(e.target.value) || 0)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter chat ID"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFormData('password', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
        )
      case 'server-type':
        return (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Server type messages don't require additional parameters.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              You'll be able to select the source and destination nodes after clicking Continue.
            </p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getFormTitle()}</DialogTitle>
          <DialogDescription>
            {getFormDescription()}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormFields()}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Continue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default MessageForm
export type { MessageFormData }
