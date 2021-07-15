import React from "react";
import Image from "next/image";
import { Button, Col, Row } from "react-bootstrap";
import Router from "next/router";
import { NextSeo } from "next-seo";
import { Layout } from "./Layout";

export const AboutPage = (): JSX.Element => {
  return (
    <Layout>
      <NextSeo />
      <Row className="hima-share-index mt-5">
        <Col md={6} className="text-center align-self-center">
          <h1>Hima Share(β)</h1>
          <p>あなたの暇な日をシェアしよう</p>
        </Col>
        <Col md={6} className="align-self-center">
          <Image
            src="/calender_writing_color.png"
            alt="Calender writing color"
            width={396.3}
            height={250}
          />
        </Col>
      </Row>

      <Row className="justify-content-center mt-5">
        <h2>使い方</h2>
      </Row>

      <Row className="justify-content-center mt-5">
        <Col md={4} className="align-self-center">
          <Image
            src="/about1.png"
            alt="Hima share about1"
            width={300}
            height={300}
          />
          <h4 className="text-center">暇な日をカレンダーに入力</h4>
        </Col>
        <Col md={4} className="align-self-center">
          <Image
            src="/about2.png"
            alt="Hima share about2"
            width={300}
            height={300}
          />
          <h4 className="text-center">グループ内で暇な日を共有</h4>
        </Col>
        <Col md={4} className="align-self-center">
          <Image
            src="/about3.png"
            alt="Hima share about3"
            width={300}
            height={300}
          />
          <h4 className="text-center">暇な人を誘うメッセージを生成</h4>
        </Col>
      </Row>
      <Row className="justify-content-center mt-5">
        <p className="text-muted">
          ※開発中のため通知することなく仕様が変更されることがあります
        </p>
      </Row>
      <Row className="justify-content-center mt-5">
        <h2>まずは登録から</h2>
      </Row>
      <Row className="justify-content-center mt-3">
        <Button
          variant="accent"
          size="lg"
          onClick={() => {
            Router.push("/register");
          }}
        >
          ユーザー登録
        </Button>
      </Row>
    </Layout>
  );
};
