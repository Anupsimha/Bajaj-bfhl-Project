import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fibonacci(n) {
  const res = [];
  let a = 0, b = 1;

  for (let i = 0; i < n; i++) {
    res.push(a);
    [a, b] = [b, a + b];
  }
  return res;
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcmArray(arr) {
  return arr.reduce((a, b) => (a * b) / gcd(a, b));
}

function hcfArray(arr) {
  return arr.reduce((a, b) => gcd(a, b));
}

const askAI = async (question) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
Answer the following question using ONLY ONE WORD.
Do not add any explanation.

Question: ${question}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return text.split(/\s+/)[0].replace(/[^a-zA-Z]/g, "");

  } catch (error) {
    console.error("Gemini AI Error:", error.message);
    throw new Error("AI service failed");
  }
};

export const bfhlController = async (req, res) => {
  try {
    const body = req.body

    const keys = Object.keys(body);
    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        message: "Request must contain exactly one key"
      });
    }

    const key = keys[0]
    let data;

    switch (key) {
      case "fibonacci":
        if (!Number.isInteger(body.fibonacci) || body.fibonacci < 0) {
          return res.status(400).json({
            is_success: false,
            message: "Invalid fibonacci input"
          });
        }
        data = fibonacci(body.fibonacci);
        break;

      case "prime":
        if (!Array.isArray(body.prime)) {
          return res.status(400).json({
            is_success: false,
            message: "Prime input must be an array"
          });
        }
        data = body.prime.filter(isPrime);
        break;

      case "lcm":
        if (!Array.isArray(body.lcm)) {
          return res.status(400).json({
            is_success: false,
            message: "LCM input must be an array"
          });
        }
        data = lcmArray(body.lcm);
        break;

      case "hcf":
        if (!Array.isArray(body.hcf)) {
          return res.status(400).json({
            is_success: false,
            message: "HCF input must be an array"
          });
        }
        data = hcfArray(body.hcf);
        break;

      case "AI":
        if (typeof body.AI !== "string") {
          return res.status(400).json({
            is_success: false,
            message: "AI input must be a string"
          });
        }
        data = await askAI(body.AI);
        break;

      default:
        return res.status(400).json({
          is_success: false,
          message: "Invalid key provided"
        });
    }

    return res.status(200).json({
      is_success: true,
      official_email: "m.n.0561.be23@chitkara.edu.in",
      data
    });

  } catch (error) {
    return res.status(500).json({
      is_success: false,
      message: "Internal Server Error"
    });
  }
};
