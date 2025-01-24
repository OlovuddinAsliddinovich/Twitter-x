import React, { useCallback, useState } from "react";
import Modal from "../ui/modal";
import { useLoginModal } from "@/hooks/use-login.modal";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import Button from "../ui/button";
import { useRegisterModal } from "@/hooks/use-register-modal";
import { NextResponse } from "next/server";
import axios from "axios";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle } from "lucide-react";

const LoginModal = () => {
  const [error, setError] = useState("");
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const form = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
    try {
      const { data: response } = await axios.post("/api/auth/login", values);
      if (response.success) {
        loginModal.onClose();
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

  const bodyContent = (
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

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Password" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button label={"Login"} fullWidth secondary large disabled={isSubmitting} type="submit" />
      </form>
    </Form>
  );

  const footerContent = (
    <div className="text-neutral-400 text-center mb-4">
      <p>
        First time using X?
        <span className="text-white cursor-pointer hover:underline ml-2" onClick={onToggle}>
          Create an account
        </span>
      </p>
    </div>
  );

  return <Modal body={bodyContent} footer={footerContent} isOpen={loginModal.isOpen} onClose={loginModal.onClose} />;
};

export default LoginModal;
