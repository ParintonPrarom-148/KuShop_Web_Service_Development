PGDMP  )                    }            kushop    16.3    16.3     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16486    kushop    DATABASE     �   CREATE DATABASE kushop WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.874';
    DROP DATABASE kushop;
                postgres    false            �           0    0    DATABASE kushop    ACL     �   REVOKE CONNECT,TEMPORARY ON DATABASE kushop FROM PUBLIC;
REVOKE ALL ON DATABASE kushop FROM postgres;
GRANT ALL ON DATABASE kushop TO dev;
                   postgres    false    4803            �            1259    16619    cartDtl    TABLE     �   CREATE TABLE public."cartDtl" (
    "cartId" character varying(100) NOT NULL,
    "pdId" character varying(100) NOT NULL,
    qty real,
    price real
);
    DROP TABLE public."cartDtl";
       public         heap    postgres    false            �           0    0    TABLE "cartDtl"    ACL     D   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public."cartDtl" TO dev;
          public          postgres    false    219            �            1259    16622    carts    TABLE     �   CREATE TABLE public.carts (
    "cartId" character varying(100) NOT NULL,
    "cusId" character varying(100),
    "cartDate" date,
    "cartCf" boolean DEFAULT false
);
    DROP TABLE public.carts;
       public         heap    postgres    false            �           0    0    TABLE carts    ACL     @   GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.carts TO dev;
          public          postgres    false    220            �          0    16619    cartDtl 
   TABLE DATA           A   COPY public."cartDtl" ("cartId", "pdId", qty, price) FROM stdin;
    public          postgres    false    219   d       �          0    16622    carts 
   TABLE DATA           H   COPY public.carts ("cartId", "cusId", "cartDate", "cartCf") FROM stdin;
    public          postgres    false    220   �       *           2606    16627    cartDtl cartDtl_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."cartDtl"
    ADD CONSTRAINT "cartDtl_pkey" PRIMARY KEY ("cartId", "pdId");
 B   ALTER TABLE ONLY public."cartDtl" DROP CONSTRAINT "cartDtl_pkey";
       public            postgres    false    219    219            ,           2606    16629    carts carts_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY ("cartId");
 :   ALTER TABLE ONLY public.carts DROP CONSTRAINT carts_pkey;
       public            postgres    false    220            �      x������ � �      �      x������ � �     