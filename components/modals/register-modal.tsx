"use client";
import { useRegisterModal } from "@/hooks/use-register-modal";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import Modal from "../ui/modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerStep1Schema, registerStep2Schema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import Button from "../ui/button";
import { useLoginModal } from "@/hooks/use-login.modal";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterModal() {
  const registerModal = useRegisterModal();

  const loginModal = useLoginModal();

  const [step, setStep] = useState<number>(1);
  const [data, setData] = useState({ name: "", email: "" });

  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  const bodyContent = step === 1 ? <RegisterStep1 setData={setData} setStep={setStep} /> : <RegisterStep2 data={data} />;

  const footer = (
    <div className="text-neutral-400 text-center mb-4">
      <p>
        Already have an account?
        <span className="text-white cursor-pointer hover:underline ml-2" onClick={onToggle}>
          Sign in
        </span>
      </p>
    </div>
  );

  return <Modal body={bodyContent} footer={footer} isOpen={registerModal.isOpen} onClose={registerModal.onClose} step={step} totalStep={2} />;
}

function RegisterStep1({
  setData,
  setStep,
}: {
  setData: Dispatch<SetStateAction<{ name: string; email: string }>>;
  setStep: Dispatch<SetStateAction<number>>;
}) {
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof registerStep1Schema>>({
    defaultValues: {
      email: "",
      name: "",
    },
    resolver: zodResolver(registerStep1Schema),
  });

  async function onSubmit(values: z.infer<typeof registerStep1Schema>) {
    try {
      const { data } = await axios.post("/api/auth/register?step=1", values);
      if (data.success) {
        setData(values);
        setStep(2);
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-12 ">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button label="Next" type="submit" fullWidth secondary large disabled={isSubmitting} />
      </form>
    </Form>
  );
}

function RegisterStep2({ data }: { data: { email: string; name: string } }) {
  const registerModal = useRegisterModal();
  const [error, setError] = useState("");
  const form = useForm<z.infer<typeof registerStep2Schema>>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(registerStep2Schema),
  });

  async function onSubmit(values: z.infer<typeof registerStep2Schema>) {
    try {
      const { data: response } = await axios.post("/api/auth/register?step=2", { ...data, ...values });
      if (response.success) {
        signIn("credentials", {
          email: response.email,
          password: values.password,
        });
        registerModal.onClose();
      }
    } catch (error: any) {
      if (error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  }

  const { isSubmitting } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-12">
        {error && (
          <Alert variant={"destructive"}>
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input type="password" {...field} placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button label="Register" large secondary fullWidth disabled={isSubmitting} />
      </form>
    </Form>
  );
}
