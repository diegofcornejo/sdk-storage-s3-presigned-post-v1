import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { S3Client } from "@aws-sdk/client-s3";

export const handler = async (event) => {

	const done = (statusCode, body) => {
		return {
			statusCode,
			body: JSON.stringify(body) // body must be string
		};
	}

	try {
		const body = JSON.parse(event.body);
		const path = body.path;
		const file = body.file;

		const client = new S3Client({ region: "us-west-1" });
		const Bucket = body.bucket || "randomcontent";
		const Key = `${key}/${file}`;
		const Fields = {
			acl: "bucket-owner-full-control",
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
		console.error("🚀 ~ file: index.mjs:41 ~ handler ~ error", error)
		return done(500, error);
	}
};
