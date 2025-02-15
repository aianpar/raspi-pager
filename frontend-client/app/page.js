"use client"
import Image from "next/image";
import { postData } from "./api/route";
import { useForm } from "react-hook-form";
import { useState } from "react";
// import { getData } from "./api/route";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Textarea } from "@/components/ui/textarea"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"



const formSchema = z.object({
  image_id: z.preprocess((val) => Number(val), z.number()),
  sender: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(7, {
    message: "Username cannot be longer than 7 characters.",
  }),
  message: z.string().min(1, {
    message: "Cannot be empty",
  }).max(50, {
    message: "Cannot be longer than 50 characters",
  }),
})




export default function Home() {

  const [charCount, setCharCount] = useState(0)
  const [open, setOpen] = useState(false);

  const handleTextareaChange = (event) => {
    console.log(event.target.value)
    setCharCount(event.target.value.length)
  }



  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image_id: undefined,
      sender: "",
      message: "",
    },
  })

  function onSubmit(values) {
    console.log(values)
    postData(values)
    form.reset()
    setOpen(true)
    setCharCount(0)
  }

  return (
    <div className="flex max-w-screen-sm basis-5xl justify-center mx-auto items-center min-h-screen">
      <Card className="my-auto w-full">
        <CardHeader>
          <CardTitle>Send a message</CardTitle>
          <CardDescription>to a pager</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="image_id"
                render={({ field }) => (
                  <FormItem>
                    <FormDescription>
                      Choose an image to send to pager
                    </FormDescription>
                    <FormLabel>Image</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an image" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Sleepy</SelectItem>
                        <SelectItem value="1">Happy Dancing</SelectItem>
                        <SelectItem value="2">Cats Discussing</SelectItem>
                        <SelectItem value="3">Wizard</SelectItem>
                        <SelectItem value="4">Hug both cats ok</SelectItem>
                        <SelectItem value="5">Weird angel</SelectItem>
                        <SelectItem value="6">Pistol</SelectItem>
                        <SelectItem value="7">Buff</SelectItem>
                        <SelectItem value="8">Pat</SelectItem>
                        <SelectItem value="9">Sleep2</SelectItem>
                        <SelectItem value="10">Motorcycle</SelectItem>
                        <SelectItem value="11">Hangout w friends</SelectItem>
                        <SelectItem value="12">Flowers</SelectItem>
                        <SelectItem value="13">Cooking</SelectItem>
                        <SelectItem value="14">Touch Cat</SelectItem>
                        <SelectItem value="15">Floating Duck</SelectItem>
                        <SelectItem value="16">Hug Cat one is sad</SelectItem>
                        <SelectItem value="17">Baloon</SelectItem>
                        <SelectItem value="18">cat feet</SelectItem>
                        <SelectItem value="19">Fist bump</SelectItem>
                        <SelectItem value="20">:0</SelectItem>
                        <SelectItem value="21">Hi exclamation</SelectItem>
                        <SelectItem value="22">Group Hangy</SelectItem>
                        <SelectItem value="23">Pokerface</SelectItem>
                        <SelectItem value="24">Cat love</SelectItem>
                        <SelectItem value="25">Winner</SelectItem>
                        <SelectItem value="26">Yawning</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input placeholder="You Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormDescription>
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        onChangeCapture={(e) => handleTextareaChange(e)}
                        className="resize-none" placeholder="Hope you are well!" {...field} />
                    </FormControl>
                    <FormMessage />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{charCount} / 50</span>
                      <span>{50 - charCount} characters remaining</span>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit">Send</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center">The Message Sent!!</AlertDialogTitle>
            <AlertDialogDescription>

            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>NICE!!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
