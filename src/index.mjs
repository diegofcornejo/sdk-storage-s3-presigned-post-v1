import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";

export const handler = async (event) => {

	console.info(JSON.stringify(event));

	const done = (statusCode, body) => {
		return {
			statusCode,
			headers: {
				"Access-Control-Allow-Headers": "*",
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
				"Access-Control-Allow-Credentials": true
			},
			body: JSON.stringify(body) // body must be string
		};
	}

	// Enable CORS if you need to request directly from the browser
	// this is necessary if the integration in apigateway is a lambda proxy
	if (event.httpMethod === "OPTIONS") {
		return done(200, {});
	}

	try {
		const body = JSON.parse(event.body);
		const path = body.path;
		const file = body.file;
		const region = body.region || "us-east-1";

		const client = new S3Client({ region });
		const Bucket = body.bucket;
		const Key = `${path}/${file}`;
		const Fields = {
			acl: "bucket-owner-full-control",
			"Content-Type": body.contentType || "application/octet-stream"
		};

		const { url, fields } = await createPresignedPost(client, {
			Bucket,
			Key,
			// Conditions,
			Fields,
			Expires: 3600, //Seconds before the presigned post expires. 3600 by default.
		});

		const res = {
			url,
			fields
		};

		return done(200, res);

	} catch (error) {
		console.error("🚀 ~ file: index.mjs:42 ~ handler ~ error", error)
		return done(500, error);
	}
};
